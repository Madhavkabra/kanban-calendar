import { useDrop } from "react-dnd";
import { format } from "date-fns";
import DraggableEventCard from "../DraggableEventCard";
import { Event } from "@/types";
import { useEffect, useRef } from "react";

interface DropColumnProps {
  date: Date;
  events: Event[];
  onDropEvent: (event: Event) => void;
  onCardClick: (event: Event) => void;
}

export default function DropColumn({
  date,
  events,
  onDropEvent,
  onCardClick,
}: Readonly<DropColumnProps>) {
  const dropRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "event",
    drop: (item: Event) => onDropEvent(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Attach the drop to the ref manually
  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [drop]);

  return (
    <div
      ref={dropRef}
      className={` rounded-xl shadow p-2 transition-colors duration-200 min-h-screen ${
        isOver ? "bg-blue-100" : "bg-white"
      }`}
    >
      <div className="font-semibold mb-2">{format(date, "EEEE")}</div>
      <div className="space-y-4">
        {events.map((event) => (
          <DraggableEventCard
            key={event.id}
            event={event}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}
