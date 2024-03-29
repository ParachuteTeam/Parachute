import React, { useState } from "react";
import Link from "next/link";
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineSearch,
} from "react-icons/md";
import {
  formatOccurring,
  formatTimeWithDay,
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
            {formatTimeWithDay(event.begins, event.timeZone)} -{" "}
            {formatTimeWithDay(event.ends, event.timeZone)}
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
          <div>No one except host has filled yet</div>
        ) : (
          <div>{event.participantCount} people filled including host</div>
        )}
      </div>
    </Link>
  );
};

const EventCardSkeleton: React.FC = () => {
  return (
    <div className="card mb-4 flex flex-col items-start gap-2.5 bg-gray-50 p-5">
      <div className="skeleton h-4 max-w-[300px]" />
      <div className="skeleton h-7 max-w-[400px]" />
      <div className="skeleton h-4 max-w-[210px]" />
    </div>
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
      {!participatedEvents &&
        [1, 2, 3, 4].map((i) => <EventCardSkeleton key={i} />)}
      {participatedEvents?.length === 0 && (
        <div className="flex h-[220px] w-full flex-col items-center justify-center gap-1">
          <div className="text-lg font-semibold text-gray-500">
            No events found!
          </div>
          <div className="text-sm text-gray-400">
            Create or join some events to get started.
          </div>
        </div>
      )}
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
