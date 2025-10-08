"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { SimpleCalendar } from "@/components/ui/simple-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function CalendarComparisonPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Calendar Components Comparison</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-6 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Current Calendar (Enhanced)</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Selected date: {date?.toDateString()}</p>
          </div>
        </div>
        
        <div className="space-y-6 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">New Simple Calendar</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <SimpleCalendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Selected date: {date?.toDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10 max-w-2xl mx-auto text-center">
        <h3 className="text-lg font-medium mb-2">Component Differences</h3>
        <p className="text-muted-foreground">
          The enhanced calendar has more custom styling and functionality, while the simple calendar
          provides a more minimal, standard calendar interface.
        </p>
      </div>
    </div>
  )
}