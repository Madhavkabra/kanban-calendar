import { useDrag } from "react-dnd";
import EventCard from "../EventCard";
import { Event } from "@/types";
import { useEffect, useRef } from "react";

interface DraggableEventCardProps {
  event: Event;
}

export default function DraggableEventCard({
  event,
}: //   onClick,
Readonly<DraggableEventCardProps>) {
  const dragRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: event,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Attach the drop to the ref manually
  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  return (
    <div
      ref={dragRef}
      className={`${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <EventCard event={event} />
    </div>
  );
}
