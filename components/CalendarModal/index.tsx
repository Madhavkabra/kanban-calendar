import { Event } from "@/types";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import EventCard from "../EventCard";
import { useState } from "react";

export default function CalendarModal({
  events,
  initialEvent,
  onClose,
}: {
  events: Event[];
  initialEvent: Event;
  onClose: () => void;
}) {
  const initialIndex = events?.findIndex((e) => e.id === initialEvent.id);
  const [deck, setDeck] = useState<Event[]>([
    ...events.slice(initialIndex),
    ...events.slice(0, initialIndex),
  ]);

  const handleNext = () => {
    setDeck((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setDeck((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -100) {
      handleNext(); // swipe up
    }
  };

  return (
    <AnimatePresence>
      {initialEvent && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="relative w-full max-w-xl h-[600px] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Centered card stack */}
            <div className="relative w-[320px] h-[480px]">
              {deck.map((event, i) => {
                if (i > 4) return null;

                const isTop = i === 0;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    className="absolute w-full h-full"
                    style={{ zIndex: 100 - i }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      x: i * 10,
                      y: i * 10,
                      scale: 1 - i * 0.05,
                      opacity: 1 - i * 0.1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    drag={isTop ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={isTop ? handleDragEnd : undefined}
                  >
                    <EventCard event={event} customClass="h-[300px]" />
                  </motion.div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-center gap-6">
              <button
                onClick={handlePrev}
                className="bg-white text-black rounded-full px-4 py-2 shadow"
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                className="bg-white text-black rounded-full px-4 py-2 shadow"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
