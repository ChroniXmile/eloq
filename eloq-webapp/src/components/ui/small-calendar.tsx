"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, format, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarEvent {
  date: string;
  title?: string;
  time?: string;
  location?: string;
}

interface SmallCalendarProps {
  className?: string;
  date?: Date;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

const serializeDateKey = (value: Date) => format(value, "yyyy-MM-dd");

type NormalizedEvent = {
  title: string;
  time?: string;
  location?: string;
};

export function SmallCalendar({ className, date, events = [], onDateSelect }: SmallCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date());

  const eventMap = React.useMemo(() => {
    const map = new Map<string, NormalizedEvent[]>();

    events.forEach((event) => {
      if (!event?.date) {
        return;
      }

      const parsed = new Date(event.date);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }

      const key = serializeDateKey(parsed);
      const label = event.time
        ? event.time
        : parsed.getHours() === 0 && parsed.getMinutes() === 0
        ? "All day"
        : parsed.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

      const normalized: NormalizedEvent = {
        title: event.title ?? "Scheduled Event",
        time: label,
        location: event.location,
      };

      const existing = map.get(key);
      if (existing) {
        existing.push(normalized);
      } else {
        map.set(key, [normalized]);
      }
    });

    return map;
  }, [events]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks: Date[][] = [];
  let week: Date[] = [];

  // Add empty cells for days before the start of the month
  const firstDayOfWeek = monthStart.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(new Date(0)); // Placeholder for empty cells
  }

  daysInMonth.forEach((day, index) => {
    week.push(day);
    
    if (week.length === 7 || index === daysInMonth.length - 1) {
      // Fill remaining slots with empty cells if needed
      while (week.length < 7) {
        week.push(new Date(0));
      }
      weeks.push([...week]);
      week = [];
    }
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <div className={cn("p-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={handlePreviousMonth}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-6 w-6 p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <span className="text-xs font-semibold">
          {format(currentMonth, "MMM yyyy")}
        </span>
        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-6 w-6 p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-px">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div 
            key={index} 
            className="text-[0.6rem] h-4 flex items-center justify-center text-muted-foreground font-medium"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="border-t border-muted mt-1 mb-1"></div>
      
      <div className="grid grid-cols-7 gap-px">
        {weeks.flat().map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const key = serializeDateKey(day);
          const dayEvents = day.getDate() !== 0 ? eventMap.get(key) : undefined;
          const hasEvents = !!dayEvents && dayEvents.length > 0;
          const eventCount = hasEvents ? dayEvents.length : 0;

          const cell = (
            <div
              onClick={() => day.getDate() !== 0 && onDateSelect && onDateSelect(day)}
              className={cn(
                "h-5 flex items-center justify-center text-[0.6rem]",
                day.getDate() !== 0 && "cursor-pointer hover:bg-accent rounded-sm",
                isCurrentDay && "bg-primary text-primary-foreground rounded-sm",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                hasEvents && !isCurrentDay && "relative"
              )}
              aria-label={
                day.getDate() !== 0
                  ? `${format(day, "MMMM d, yyyy")}${hasEvents ? ` • ${eventCount} event${eventCount > 1 ? "s" : ""}` : ""}`
                  : undefined
              }
            >
              {day.getDate() !== 0 && (
                <span className={cn("relative", isCurrentDay ? "text-primary-foreground" : "") }>
                  {format(day, "d")}
                  {hasEvents && !isCurrentDay && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-1 m-auto h-0.5 w-3 rounded bg-primary"
                    />
                  )}
                </span>
              )}
            </div>
          );

          if (hasEvents) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>{cell}</TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] space-y-1 text-left">
                  {dayEvents?.map((event, eventIndex) => (
                    <div key={`${key}-${eventIndex}`} className="space-y-0.5">
                      <p className="text-xs font-semibold leading-none text-background">{event.title}</p>
                      {event.time && (
                        <p className="text-[0.65rem] uppercase tracking-wide leading-none text-background/80">
                          {event.time}
                          {event.location ? ` • ${event.location}` : ''}
                        </p>
                      )}
                      {!event.time && event.location && (
                        <p className="text-[0.65rem] uppercase tracking-wide leading-none text-background/80">
                          {event.location}
                        </p>
                      )}
                    </div>
                  ))}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <div key={index}>
              {cell}
            </div>
          );
        })}
      </div>
    </div>
  );
}
