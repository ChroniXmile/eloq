"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, format, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SmallCalendarProps {
  className?: string;
  date?: Date;
  onDateSelect?: (date: Date) => void;
}

export function SmallCalendar({ className, date, onDateSelect }: SmallCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date());

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
          
          return (
            <div
              key={index}
              onClick={() => day.getDate() !== 0 && onDateSelect && onDateSelect(day)}
              className={cn(
                "h-5 flex items-center justify-center text-[0.6rem]",
                day.getDate() !== 0 && "cursor-pointer hover:bg-accent rounded-sm",
                isCurrentDay && "bg-primary text-primary-foreground rounded-sm",
                !isCurrentMonth && "text-muted-foreground opacity-50"
              )}
            >
              {day.getDate() !== 0 && (
                <span className={isCurrentDay ? "text-primary-foreground" : ""}>
                  {format(day, "d")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SmallCalendar };