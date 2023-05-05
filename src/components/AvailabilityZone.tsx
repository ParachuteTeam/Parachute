import React, { useEffect, useMemo, useState } from "react";
import { add, format } from "date-fns";
import {
  MdOutlineEditCalendar,
  MdOutlineFileDownloadDone,
  MdOutlineMouse,
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoEarthSharp } from "react-icons/io5";
import { api } from "../utils/api";
import { TimeslotSelector, TimeslotView } from "./Timeslot";
import type { DatetimeInterval } from "../utils/utils";
import {
  isBetween,
  toDatetimeIntervals,
  toIndividualDates,
} from "../utils/utils";

interface MyAvailabilityZoneProps {
  occurringDaysArray: Date[];
  eventID: string;
  weekOnly?: boolean;
}

export const MyAvailabilityZone: React.FC<MyAvailabilityZoneProps> = ({
  occurringDaysArray,
  eventID,
  weekOnly,
}) => {
  const [schedule, setSchedule] = useState<Date[]>([]);
  const [changed, setChanged] = useState(false);

  const updateSchedule = (newSchedule: Date[]) => {
    setSchedule(newSchedule);
    setChanged(true);
  };

  const { data: existingSchedule, refetch } =
    api.timeslots.getAllTimeSlots.useQuery({
      eventID: eventID,
    });
  const resetSchedule = () => {
    if (!changed) {
      const intervals: DatetimeInterval[] =
        existingSchedule?.map((timeslot) => ({
          start: timeslot.begins,
          end: timeslot.ends,
        })) ?? [];
      setSchedule(toIndividualDates(intervals, { minutes: 15 }, true));
    }
  };
  useEffect(resetSchedule, [changed, existingSchedule]);

  const scheduleReplace = api.timeslots.timeslotsReplace.useMutation();
  const saveTimeSlots = () => {
    const intervals = toDatetimeIntervals(schedule, { minutes: 15 }, true);
    scheduleReplace.mutate(
      {
        eventID: eventID,
        timeslots: intervals.map((itv) => ({
          begins: itv.start.toJSON(),
          ends: itv.end.toJSON(),
        })),
      },
      {
        onSuccess: () => {
          refetch().finally(() => {
            setChanged(false);
          });
        },
      }
    );
  };

  return (
    <div className="relative h-[500px]">
      <div className="absolute left-8 top-4 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineEditCalendar className="text-md" />
        Click or drag to select available time slots
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <div className="card flex h-36 w-64 flex-col items-center justify-center gap-2 p-4 shadow-lg">
          {changed ? (
            <>
              <div className="flex flex-row items-center justify-center gap-1 p-1">
                <FiEdit className="text-sm" />
                <div className="text-sm text-gray-500">
                  Unsaved change detected
                </div>
              </div>
              <button
                className="primary-button-with-hover w-full text-sm"
                onClick={saveTimeSlots}
              >
                Save
              </button>
              <button
                className="rounded-button w-full text-sm"
                onClick={resetSchedule}
              >
                Discard
              </button>
            </>
          ) : (
            <>
              <MdOutlineFileDownloadDone className="text-5xl text-gray-500" />
              <div className="mt-1 text-lg font-bold">File Saved</div>
              <div className="text-[12px] font-light text-gray-500">
                Availability is up to date
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <TimeslotSelector
          occurringDates={occurringDaysArray}
          startTime={8}
          endTime={20}
          schedule={schedule}
          onChange={updateSchedule}
          weekOnly={weekOnly}
        />
      </div>
    </div>
  );
};

const AvailablePerson: React.FC<{
  id?: string;
  name: string;
  setHoveredPerson?: (id: string | null) => void;
}> = ({ id, name, setHoveredPerson }) => {
  return (
    <div
      className="flex flex-row items-center gap-1"
      onMouseEnter={() => setHoveredPerson?.(id ?? null)}
      onMouseLeave={() => setHoveredPerson?.(null)}
    >
      <div className="font-semibold">{name}</div>
      <IoEarthSharp className="text-md ml-2 text-gray-500" />
      <div className="text-gray-500">Chicago (GMT-8)</div>
    </div>
  );
};

interface GroupAvailabilityZoneProps {
  occurringDaysArray: Date[];
  eventID: string;
  weekOnly?: boolean;
}

export const GroupAvailabilityZone: React.FC<GroupAvailabilityZoneProps> = ({
  occurringDaysArray,
  eventID,
  weekOnly,
}) => {
  const { data: existingSchedule } =
    api.timeslots.getAllTimeSlots_Event.useQuery({
      eventID: eventID,
    });

  const { data: participants } = api.events.getAllParticipants.useQuery({
    eventId: eventID,
  });

  const participantsMap = useMemo(() => {
    const map: Record<string, string> = {};
    participants?.forEach((participant) => {
      map[participant.userID] = participant.user.name;
    });
    return map;
  }, [participants]);

  const [hoveredTime, setHoveredTime] = useState<Date | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);

  const schedule = useMemo(() => {
    const intervals: DatetimeInterval[] =
      existingSchedule
        ?.filter(
          (timeslot) =>
            !hoveredPerson || timeslot.participateUserID == hoveredPerson
        )
        .map((timeslot) => ({
          start: timeslot.begins,
          end: timeslot.ends,
        })) ?? [];
    return toIndividualDates(intervals, { minutes: 15 }, true);
  }, [existingSchedule, hoveredPerson]);

  return (
    <div className="relative h-[500px]">
      <div className="absolute left-8 top-4 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineMouse className="text-md" />
        Hover on slots to see who is available
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <div className="card flex h-96 w-96 flex-col items-start justify-start gap-3 p-6 text-sm shadow-lg">
          {hoveredPerson || !hoveredTime ? (
            <>
              <div className="mb-6 text-xs text-gray-500">
                {hoveredPerson
                  ? `Now displaying availability of ${
                      participantsMap[hoveredPerson] ?? ""
                    }`
                  : "All people filled (hover to see their availability):"}
              </div>
              {participants?.map((participant) => (
                <AvailablePerson
                  key={participant.userID}
                  id={participant.userID}
                  name={participant.user.name}
                  setHoveredPerson={setHoveredPerson}
                />
              ))}
            </>
          ) : (
            <>
              <div className="mb-6 text-xs text-gray-500">
                People available on {format(hoveredTime, "EEEEEEE")} from{" "}
                {format(hoveredTime, "p")} to{" "}
                {format(add(hoveredTime, { minutes: 15 }), "p")}:
              </div>
              {existingSchedule
                ?.filter((timeslot) => {
                  return isBetween(hoveredTime, timeslot.begins, timeslot.ends);
                })
                .map((timeslot) => {
                  return (
                    <AvailablePerson
                      key={timeslot.id}
                      name={
                        participantsMap[timeslot.participateUserID ?? ""] ?? ""
                      }
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <TimeslotView
          occurringDates={occurringDaysArray}
          startTime={8}
          endTime={20}
          schedule={schedule}
          maxScheduleCount={participants?.length ?? 0}
          setHoveredTime={setHoveredTime}
          weekOnly={weekOnly}
        />
      </div>
    </div>
  );
};
