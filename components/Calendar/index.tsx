"use client";

import DropColumn from "@/components/DropColumn";
import events from "@/data/index";
import { Event } from "@/types";
import { addDays, format, startOfWeek, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMediaQuery } from "react-responsive";
import EdgeDragWatcher from "../EdgeDragWatcher";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";

const Calendar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [currentDate, setCurrentDate] = useState(new Date("2024-03-11"));
  const [calendarEvents, setCalendarEvents] = useState(events);

  // Calculate current and next sets of dates
  const currentWeekDates = useMemo(() => {
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
      const updated = Object.entries(prev).reduce(
        (acc, [dateStr, eventList]) => {
          acc[dateStr] = eventList.filter((e) => e.id !== droppedEvent.id);
          return acc;
        },
        {} as typeof prev
      );

      updated[targetDateStr] = [
        ...(updated[targetDateStr] ?? []),
        droppedEvent,
      ];
      return { ...updated };
    });
  };

  const getBackendOptions = () => ({
    backends: [
      {
        backend: HTML5Backend,
        preview: true,
        debugMode: true,
        id: "html5", // ← Add this
      },
      {
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        preview: true,
        delayTouchStart: 100,
        transition: TouchTransition,
        debugMode: true,
        id: "touch", // ← Add this
      },
    ],
  });

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <EdgeDragWatcher
        moveToNext={handleNext}
        moveToPrev={handlePrev}
        isMobile={isMobile}
      />

      <div className="min-h-screen sm:p-4 bg-gradient-to-br from-[#f6f8ff] to-[#eef1f9]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrev} className="text-xl cursor-pointer">
            ←
          </button>
          <h1 className="text-lg font-bold">
            {isMobile
              ? format(currentDate, "EEE, MMM d")
              : `${format(currentWeekDates[0], "MMM d")} - ${format(
                  currentWeekDates[6],
                  "MMM d"
                )}`}
          </h1>
          <button onClick={handleNext} className="text-xl cursor-pointer">
            →
          </button>
        </div>

        {/* Calendar Grid */}
        {isMobile ? (
          <div className="relative">
            {[currentDate, addDays(currentDate, 1)].map((date, index) => {
              const dayStr = format(date, "yyyy-MM-dd");
              const isCurrent = index === 0;
              return (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${
                    isCurrent
                      ? "opacity-100 z-10"
                      : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <DropColumn
                    date={date}
                    events={calendarEvents[dayStr] ?? []}
                    onDropEvent={(event) => handleDrop(dayStr, event)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-4">
              {currentWeekDates.map((date) => {
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
        )}
      </div>
    </DndProvider>
  );
};

export default Calendar;
