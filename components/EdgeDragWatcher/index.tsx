// components/EdgeDragWatcher.tsx
import { useEffect, useRef } from "react";
import { useDragLayer } from "react-dnd";

export default function EdgeDragWatcher({
  isMobile,
  moveToNext,
  moveToPrev,
}: {
  isMobile: boolean;
  moveToNext: () => void;
  moveToPrev: () => void;
}) {
  const edgeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const edgeDelayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isDragging, clientOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }));

  useEffect(() => {
    if (!isDragging || !clientOffset) {
      clearTimers();
      return;
    }

    const threshold = 50;
    const screenWidth = window.innerWidth;
    const x = clientOffset.x;

    const isAtLeft = x < threshold;
    const isAtRight = x > screenWidth - threshold;

    if (isAtLeft || isAtRight) {
      // Start delay timer if not already started
      if (!edgeDelayTimerRef.current && !edgeIntervalRef.current) {
        edgeDelayTimerRef.current = setTimeout(() => {
          if (isAtLeft) moveToPrev();
          if (isAtRight) moveToNext();

          // Then set up continuous scrolling
          edgeIntervalRef.current = setInterval(() => {
            if (isAtLeft) moveToPrev();
            if (isAtRight) moveToNext();
          }, 1000);

          edgeDelayTimerRef.current = null;
        }, 1000);
      }
    } else {
      clearTimers();
    }

    return () => clearTimers();
  }, [isDragging, clientOffset, isMobile]);

  const clearTimers = () => {
    if (edgeDelayTimerRef.current) {
      clearTimeout(edgeDelayTimerRef.current);
      edgeDelayTimerRef.current = null;
    }
    if (edgeIntervalRef.current) {
      clearInterval(edgeIntervalRef.current);
      edgeIntervalRef.current = null;
    }
  };

  return null;
}
