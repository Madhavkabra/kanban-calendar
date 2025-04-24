// page.tsx
"use client";

import DropColumn from "@/components/DropColumn"; // 👈 new component
import events from "@/data/index";
import { Event } from "@/types";
import { addDays, format, startOfWeek, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMediaQuery } from "react-responsive";

const Calendar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [currentDate, setCurrentDate] = useState(new Date("2024-03-11"));
  const [calendarEvents, setCalendarEvents] = useState(events); // 👈 local state for updates

  const weekDates = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const handleNext = () => {
    setCurrentDate((prev) => (isMobile ? addDays(prev, 1) : addDays(prev, 7)));
  };

  const handlePrev = () => {
    setCurrentDate((prev) => (isMobile ? subDays(prev, 1) : subDays(prev, 7)));
  };

  const handleDrop = (targetDateStr: string, droppedEvent: Event) => {
    setCalendarEvents((prev) => {
      // 1. Remove from any day that contains the event
      const updated = Object.entries(prev).reduce(
        (acc, [dateStr, eventList]) => {
          acc[dateStr] = eventList.filter((e) => e.id !== droppedEvent.id);
          return acc;
        },
        {} as typeof prev
      );

      // 2. Add to new date
      updated[targetDateStr] = [
        ...(updated[targetDateStr] ?? []),
        droppedEvent,
      ];

      return { ...updated };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen p-4 bg-gradient-to-br from-[#f6f8ff] to-[#eef1f9]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrev} className="text-xl">
            ←
          </button>
          <h1 className="text-lg font-bold">
            {isMobile
              ? format(currentDate, "EEE, MMM d")
              : `${format(weekDates[0], "MMM d")} - ${format(
                  weekDates[6],
                  "MMM d"
                )}`}
          </h1>
          <button onClick={handleNext} className="text-xl">
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-7"} gap-4`}
        >
          {(isMobile ? [currentDate] : weekDates).map((date) => {
            const dayStr = format(date, "yyyy-MM-dd");
            return (
              <DropColumn
                key={dayStr}
                date={date}
                events={calendarEvents[dayStr] ?? []}
                onDropEvent={(event) => handleDrop(dayStr, event)}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
