"use client";

import DropColumn from "@/components/DropColumn";
import events from "@/data/index";
import { Event } from "@/types";
import { addDays, format, isSameDay, startOfWeek, subDays } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import { Preview } from "react-dnd-preview";
import { TouchBackend } from "react-dnd-touch-backend";
import { useMediaQuery } from "react-responsive";
import CalendarModal from "../CalendarModal";
import EdgeDragWatcher from "../EdgeDragWatcher";
import EventCard from "../EventCard";

const Calendar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [currentDate, setCurrentDate] = useState(new Date("2024-03-11"));
  const [calendarEvents, setCalendarEvents] = useState(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const currentWeekDates = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const [showBoard, setShowBoard] = useState(false);
  const currentDateRef = useRef(currentDate);
  const swipeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentDateRef.current = currentDate;
  }, [currentDate]);

  useEffect(() => {
    handleNext();
    setTimeout(() => {
      handlePrev();
      setShowBoard(true);
    }, 0);
  }, []);

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
      { backend: HTML5Backend, preview: true, id: "html5" },
      {
        backend: TouchBackend,
        preview: true,
        transition: TouchTransition,
        id: "touch",
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generatePreview = ({ itemType, item, style }: any): any => {
    if (itemType === "event") {
      return (
        <div style={{ ...style, zIndex: 1000, pointerEvents: "none" }}>
          <div className="max-w-xs">
            <EventCard event={item} />
          </div>
        </div>
      );
    }
    return null;
  };

  // === Swipe Logic ===
  useEffect(() => {
    const container = swipeContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handlePrev(); // swipe right
        } else {
          handleNext(); // swipe left
        }
      }
    };

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleNext, handlePrev]);

  return (
    <>
      {selectedEvent && (
        <CalendarModal
          initialEvent={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        {isMobile && <Preview generator={generatePreview} />}
        <EdgeDragWatcher
          moveToNext={handleNext}
          moveToPrev={handlePrev}
          isMobile={isMobile}
        />
        {showBoard && (
          <div
            ref={swipeContainerRef}
            className="min-h-screen sm:p-4 p-2 bg-gradient-to-br from-[#f6f8ff] to-[#eef1f9]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-4 py-3 bg-white rounded-xl shadow-md">
              <button
                onClick={handlePrev}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xl text-gray-600 transition-colors"
              >
                ←
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-700">
                {format(currentWeekDates[0], "MMM d")} -{" "}
                {format(currentWeekDates[6], "MMM d")}
              </h1>
              <button
                onClick={handleNext}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xl text-gray-600 transition-colors"
              >
                →
              </button>
            </div>

            {/* Week Days */}
            {isMobile && (
              <div className="flex overflow-x-hidden sm:px-6 mb-4 bg-white shadow-lg rounded-lg">
                {currentWeekDates.map((date) => (
                  <button
                    key={date.toString()}
                    onClick={() => setCurrentDate(date)}
                    className={`flex flex-col items-center flex-shrink-0 px-3 py-2 rounded-lg
                      ${
                        isSameDay(date, currentDate)
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }
                      transition-colors min-w-[48px]`}
                  >
                    <span className="text-sm font-medium">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-base font-bold">
                      {format(date, "d")}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Calendar Grid */}
            {isMobile ? (
              <div className="relative">
                <DropColumn
                  date={currentDate}
                  onCardClick={(event) => setSelectedEvent(event)}
                  events={
                    calendarEvents[format(currentDate, "yyyy-MM-dd")] ?? []
                  }
                  onDropEvent={(event) =>
                    handleDrop(
                      format(currentDateRef.current, "yyyy-MM-dd"),
                      event
                    )
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-4">
                {currentWeekDates.map((date) => {
                  const dayStr = format(date, "yyyy-MM-dd");
                  return (
                    <DropColumn
                      key={dayStr}
                      onCardClick={(event) => setSelectedEvent(event)}
                      date={date}
                      events={calendarEvents[dayStr] ?? []}
                      onDropEvent={(event) => handleDrop(dayStr, event)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DndProvider>
    </>
  );
};

export default Calendar;
