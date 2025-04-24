import { Event } from "@/types";
import { format, addDays, startOfWeek } from "date-fns";
import DayColumn from "../DayColumn";

interface Props {
  events: { [date: string]: Event[] };
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function CalendarBoard({
  events,
  currentDate,
  setCurrentDate,
}: Readonly<Props>) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const getWeekDates = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const days = isMobile ? [currentDate] : getWeekDates();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentDate(addDays(currentDate, isMobile ? -1 : -7))
          }
        >
          ← Prev
        </button>
        <div className="text-xl font-bold">
          Week of {format(currentDate, "MMM dd")}
        </div>
        <button
          onClick={() => setCurrentDate(addDays(currentDate, isMobile ? 1 : 7))}
        >
          Next →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <DayColumn
            key={day.toISOString()}
            date={day}
            events={events[format(day, "yyyy-MM-dd")] || []}
          />
        ))}
      </div>
    </div>
  );
}
