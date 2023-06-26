import React, { useState } from "react";
import Link from "next/link";
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineSearch,
} from "react-icons/md";
import {
  formatOccurring,
  formatTime,
  formatTimeZoneTag,
} from "../../utils/date-utils";
import { IoEarthSharp } from "react-icons/io5";
import { EventTypeTag } from "../ui/Tag";
import { useSession } from "next-auth/react";
import { useParticipatedEvents } from "../../utils/api-hooks";

interface Event {
  id: string;
  name?: string;
  occuringDays?: string;
  joinCode: string;
  begins: Date;
  ends: Date;
  type?: string;
  timeZone?: string;
  ownerID?: string;
  participantCount?: number;
  // Add other properties as needed
}
interface EventCardProps {
  event: Event;
  myEvent: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, myEvent }) => {
  const eventId = event.id;
  const eventName = event.name;
  const occurringDaysArray = event.occuringDays
    ?.split(",")
    .map((s) => new Date(s));

  return (
    <Link
      className="card mb-4 flex flex-col gap-1 p-5 hover:ring-2 hover:ring-gray-300"
      href={`/event/${eventId}`}
    >
      <div className="flex flex-row items-center gap-1 text-xs text-gray-500 md:text-sm">
        <div className="flex flex-row items-center gap-1">
          <MdOutlineCalendarToday />
          <div>
            {formatOccurring(
              occurringDaysArray ?? [],
              event.type === "DAYSOFWEEK",
              event.timeZone
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <MdOutlineAccessTime className="ml-1" />
          <div>
            {formatTime(event.begins, event.timeZone)} -{" "}
            {formatTime(event.ends, event.timeZone)}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <IoEarthSharp className="ml-1" />
          <div>{formatTimeZoneTag(event.timeZone ?? "")}</div>
        </div>
      </div>
      <div className="mb-0.5 text-xl font-semibold">{eventName}</div>
      <div className="flex flex-row items-center gap-2 text-sm">
        {myEvent && <EventTypeTag>My Event</EventTypeTag>}
        {event.participantCount === 1 ? (
          <div>{event.participantCount} person filled including host</div>
        ) : (
          <div>{event.participantCount} people filled including host</div>
        )}
      </div>
    </Link>
  );
};

export const EventList = () => {
  const { data: participatedEvents } = useParticipatedEvents();
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const filteredEvents = participatedEvents?.filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="event-list-container">
      <div className="card mb-4 flex flex-row items-center px-4 text-sm">
        <MdOutlineSearch className="mr-2 text-lg text-gray-500" />
        <input
          className="h-full w-full py-4 focus:outline-none"
          placeholder="Search for an event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredEvents?.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          myEvent={event.ownerID === session?.user.id}
        />
      ))}
    </div>
  );
};
