import { Event } from "@/types";
import Image from "next/image";

export default function EventCard({ event }: Readonly<{ event: Event }>) {
  return (
    <div className="cursor-pointer rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md mb-3">
      <div className="mt-2 w-full h-32 relative rounded-md overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      </div>
      <div className=" p-2 ">
        <div className="font-bold text-sm mb-1">{event.title}</div>
        <div className="text-xs opacity-90">{event.time}</div>
        <div className="text-sm text-gray-200 line-clamp-2">
          {event.description}
        </div>
      </div>
    </div>
  );
}
