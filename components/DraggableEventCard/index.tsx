import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import EventCard from "../EventCard";
import { Event } from "@/types";
import { useEffect, useRef } from "react";

interface DraggableEventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}

export default function DraggableEventCard({
  event,
  onClick,
}: DraggableEventCardProps) {
  const dragRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: event,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  return (
    <motion.div
      ref={dragRef}
      layoutId={`event-${event.id}`}
      onClick={() => onClick?.(event)}
      className={`cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      } sm:max-w-full max-w-[90%]`}
    >
      <EventCard event={event} />
    </motion.div>
  );
}
