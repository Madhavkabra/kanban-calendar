import { Event } from "@/types";
import { format } from "date-fns";
import EventCard from "../EventCard";

interface Props {
  date: Date;
  events: Event[];
}

export default function DayColumn({ date, events }: Readonly<Props>) {
  return (
    <div className="bg-white rounded-xl shadow-md p-2 min-h-[300px]">
      <div className="text-center font-semibold text-lg mb-2">
        {format(date, 'EEE dd')}
      </div>
      <div className="space-y-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
