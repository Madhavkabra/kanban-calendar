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
  const edgeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isDragging, clientOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }));

  useEffect(() => {
    if (!isDragging || !clientOffset) {
      clearTimeout(edgeTimerRef.current!);
      edgeTimerRef.current = null;
      return;
    }

    const threshold = 50;
    const screenWidth = window.innerWidth;
    const x = clientOffset.x;

    const isAtLeft = x < threshold;
    const isAtRight = x > screenWidth - threshold;
    if (isAtLeft || isAtRight) {
      edgeTimerRef.current = setTimeout(() => {
        if (isAtLeft) {
          moveToPrev();
        } else if (isAtRight) {
          moveToNext();
        }
      }, 1500);
    } else {
      clearTimeout(edgeTimerRef.current!);
      edgeTimerRef.current = null;
    }

    return () => {
      clearTimeout(edgeTimerRef.current!);
    };
  }, [isDragging, clientOffset, isMobile]);

  return null; // This component just hooks into the drag layer
}
