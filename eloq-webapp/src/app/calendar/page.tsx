'use client';

import { FullScreenCalendar } from '@/components/ui/fullscreen-calendar';

// Sample data for the calendar
const sampleCalendarData = [
  {
    day: new Date(new Date().getFullYear(), new Date().getMonth(), 15), // 15th of current month
    events: [
      { id: 1, name: 'Tournament Finals', time: '6:00 PM', datetime: '2023-08-15T18:00:00' },
      { id: 2, name: 'Practice Session', time: '10:00 AM', datetime: '2023-08-15T10:00:00' },
    ],
  },
  {
    day: new Date(new Date().getFullYear(), new Date().getMonth(), 20), // 20th of current month
    events: [
      { id: 3, name: 'Local Tournament', time: '2:00 PM', datetime: '2023-08-20T14:00:00' },
    ],
  },
  {
    day: new Date(new Date().getFullYear(), new Date().getMonth(), 25), // 25th of current month
    events: [
      { id: 4, name: 'Ranking Update', time: 'All Day', datetime: '2023-08-25T00:00:00' },
    ],
  },
];

export default function CalendarPage() {
  return (
    <FullScreenCalendar data={sampleCalendarData} />
  );
}