'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FullScreenCalendar, CalendarEvent } from '@/components/ui/fullscreen-calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CalendarDay {
  day: Date;
  events: CalendarEvent[];
}

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/tournaments?status=upcoming', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          const message = Array.isArray(data?.errors)
            ? data.errors.join(' ')
            : data?.error || 'Failed to load tournaments.';
          setError(message);
          setCalendarData([]);
          return;
        }

        if (!Array.isArray(data)) {
          setError('Unexpected tournament response.');
          setCalendarData([]);
          return;
        }
        const grouped = new Map<string, CalendarDay>();

        data.forEach((entry: any) => {
          if (!entry?.id || !entry?.date || !entry?.name) {
            return;
          }

          const date = new Date(entry.date);
          if (Number.isNaN(date.getTime())) {
            return;
          }

          const key = format(date, 'yyyy-MM-dd');
          if (!grouped.has(key)) {
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            grouped.set(key, { day: dayStart, events: [] });
          }
          const label = date.getHours() === 0 && date.getMinutes() === 0
            ? 'All day'
            : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

          const prizePool = typeof entry.prizePool === 'string'
            ? parseFloat(entry.prizePool)
            : entry.prizePool;
          const fieldAverage = typeof entry.fieldAvgRating === 'string'
            ? parseFloat(entry.fieldAvgRating)
            : entry.fieldAvgRating;

          const record = grouped.get(key)!;
          record.events.push({
            id: String(entry.id),
            name: entry.name,
            time: label,
            datetime: date.toISOString(),
            location: entry.location ?? undefined,
            tier: entry.tier ?? undefined,
            status: entry.status ?? undefined,
            prizePool: typeof prizePool === 'number' && !Number.isNaN(prizePool) ? prizePool : undefined,
            description: entry.description ?? undefined,
            link: `/tournaments/${entry.id}`,
            fieldAvgRating: typeof fieldAverage === 'number' && !Number.isNaN(fieldAverage) ? fieldAverage : undefined,
          });
        });

        const days = Array.from(grouped.values()).sort((a, b) => a.day.getTime() - b.day.getTime());
        days.forEach((day) => {
          day.events.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
        });

        setCalendarData(days);
      } catch (error) {
        setError((error as Error).message);
        setCalendarData([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="container py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {isLoading && !error && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading upcoming tournaments…
          </div>
        )}
        <FullScreenCalendar data={calendarData} onEventSelect={handleEventSelect} />
        {!isLoading && calendarData.length === 0 && !error && (
          <p className="text-center text-sm text-muted-foreground">
            No upcoming tournaments scheduled yet. Add one from the admin dashboard to populate the calendar.
          </p>
        )}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedEvent(null);
          }
        }}
      >
        <DialogContent>
          {selectedEvent && (
            <div className="space-y-4">
              <DialogHeader className="space-y-2 text-left">
                <DialogTitle className="text-xl font-semibold">
                  {selectedEvent.name}
                </DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedEvent.datetime), 'EEEE, MMMM d yyyy • h:mm a')}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                {selectedEvent.status && (
                  <Badge variant="outline" className="capitalize">
                    {selectedEvent.status}
                  </Badge>
                )}
                {selectedEvent.tier && (
                  <Badge variant="outline" className="capitalize">
                    {selectedEvent.tier} tier
                  </Badge>
                )}
                {typeof selectedEvent.prizePool === 'number' && (
                  <Badge variant="outline">
                    Prize {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(selectedEvent.prizePool)}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {selectedEvent.location && (
                  <p className="text-foreground">
                    <span className="font-medium">Location:</span> {selectedEvent.location}
                  </p>
                )}
                {typeof selectedEvent.fieldAvgRating === 'number' && (
                  <p className="text-foreground">
                    <span className="font-medium">Field Average Rating:</span> {selectedEvent.fieldAvgRating}
                  </p>
                )}
                {selectedEvent.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              <Separator />

              <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedEvent(null);
                  }}
                >
                  Close
                </Button>
                {selectedEvent.link && (
                  <Button asChild>
                    <Link href={selectedEvent.link}>View Tournament Details</Link>
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
