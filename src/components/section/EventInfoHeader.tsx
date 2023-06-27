import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  useAllTimeslotsOf,
  useDeleteEvent,
  useLeaveEvent,
  useDeleteParticipantsOf,
  useEditNameOf,
  useEvent,
  useParticipantsOf,
  useParticipatedEvents,
} from "../../utils/api-hooks";
import { useSession } from "next-auth/react";
import { MdOutlineAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import {
  formatOccurring,
  formatTimespan,
  formatTimeZoneTag,
} from "../../utils/date-utils";
import { IoEarthSharp } from "react-icons/io5";
import { EventTypeTag } from "../ui/Tag";
import { DeleteDialog, EditDialog, LeaveDialog } from "./Dialog";

export const EventInfoHeader: React.FC = () => {
  const router = useRouter();
  const eventId = router.query.id as string;

  const { data: event, refetch: refetchEvent } = useEvent(eventId);
  const { refetch: refetchEventList } = useParticipatedEvents();
  const { data: participants, refetch: refetchParticipants } =
    useParticipantsOf(eventId);
  const { refetch: refetchTimeslots } = useAllTimeslotsOf(eventId);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const editEventName = useEditNameOf(eventId);
  const deleteParticipants = useDeleteParticipantsOf(eventId);
  const deleteEvent = useDeleteEvent(eventId);
  const leaveEvent = useLeaveEvent(eventId);

  const { data: session } = useSession();
  const userId = session?.user.id;
  const isOwner = event?.ownerID === userId;

  const occurringDaysArray = event?.occuringDays
    .split(",")
    .map((s: string) => new Date(s));

  if (!event) {
    return (
      <div className="flex w-full flex-row justify-center border-t border-gray-200 bg-white px-12 py-6">
        <div className="flex max-w-[1200px] flex-1 flex-row items-center gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <div className="skeleton h-5 max-w-[400px]" />
            <div className="skeleton h-9 max-w-[600px]" />
            <div className="skeleton h-5 max-w-[300px]" />
          </div>
          <div className="flex w-[200px] flex-col gap-3 text-sm font-light">
            <div className="skeleton h-9" />
            <div className="skeleton h-9" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row justify-center border-t border-gray-200 bg-white px-12 py-6">
      <div className="flex max-w-[1200px] flex-1 flex-row items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-row items-center gap-1 text-sm text-gray-500">
            <MdOutlineCalendarToday />
            <div>
              {formatOccurring(
                occurringDaysArray ?? [],
                event.type === "DAYSOFWEEK",
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                event.timeZone
              )}
            </div>
            <MdOutlineAccessTime className="ml-1" />
            <div>
              {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                formatTimespan(event.begins, event.ends, event.timeZone)
              }
            </div>
            <IoEarthSharp className="ml-1" />
            <div>
              {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                formatTimeZoneTag(event.timeZone)
              }
            </div>
          </div>
          <div className="text-3xl font-semibold">{event.name}</div>
          <div className="flex flex-row items-center gap-2 text-sm">
            {isOwner && <EventTypeTag>My Event</EventTypeTag>}
            <p>
              <span className="font-bold">Event ID:</span> {event.joinCode}
            </p>
            <p>
              <span className="font-bold">Link:</span>{" "}
              https://parachute.fyi/event/{eventId}
            </p>
          </div>
        </div>

        <div className="flex w-[200px] flex-col gap-3 text-sm font-light">
          {isOwner && (
            <button
              className="rounded-button"
              onClick={() => setIsEditDialogOpen(true)}
            >
              Edit
            </button>
          )}
          {isOwner && (
            <button
              className="danger-button"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </button>
          )}
          {!isOwner && (
            <button
              className="danger-button"
              onClick={() => setIsLeaveDialogOpen(true)}
            >
              Leave
            </button>
          )}
        </div>
      </div>
      <EditDialog
        isOpen={isEditDialogOpen}
        close={() => setIsEditDialogOpen(false)}
        eventName={event?.name ?? ""}
        participants={participants ?? []}
        onSubmit={async (newEventName, deletedUserIDs) => {
          await Promise.all([
            editEventName(newEventName),
            deleteParticipants(deletedUserIDs),
          ]);
          await Promise.all([
            refetchEvent(),
            refetchParticipants(),
            refetchTimeslots(),
          ]);
        }}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        close={() => setIsDeleteDialogOpen(false)}
        eventName={event?.name ?? "Loading..."}
        onSubmit={async () => {
          await deleteEvent();
          await refetchEventList();
          await router.push("/dashboard");
        }}
      />
      <LeaveDialog
        isOpen={isLeaveDialogOpen}
        close={() => setIsLeaveDialogOpen(false)}
        eventName={event?.name ?? "Loading..."}
        onSubmit={async () => {
          await leaveEvent();
          await refetchEventList();
          await router.push("/dashboard");
        }}
      />
    </div>
  );
};
