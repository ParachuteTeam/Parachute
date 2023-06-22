import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineEditCalendar, MdOutlineMouse } from "react-icons/md";
import { TimeslotSelector, TimeslotView } from "../ui/TimeslotGrid";
import type { DatetimeInterval } from "../../utils/utils";
import {
  csvToDateArray,
  dateArraysEqual,
  isBetween,
  toIndividualDates,
  toZonedTime,
} from "../../utils/utils";
import {
  useAllTimeslotsOf,
  useEvent,
  useUserTimeslotsIn,
  useParticipantsOf,
  useReplaceUserTimeslotsIn,
} from "../../utils/api-hooks";
import { TimeslotSavePanel } from "../ui/TimeslotSavePanel";
import { TimeSlotParticipantsPanel } from "../ui/TimeSlotParticipantsPanel";

interface MyAvailabilityZoneProps {
  eventID: string;
  timeZoneTag: string;
}

export const MyAvailabilityZone: React.FC<MyAvailabilityZoneProps> = ({
  eventID,
  timeZoneTag,
}) => {
  // API hooks
  const { data: event } = useEvent(eventID);
  const { data: existingTimeSlots, refetch: refetchSchedule } =
    useUserTimeslotsIn(eventID);
  const { refetch: refetchAllSchedules } = useAllTimeslotsOf(eventID);

  // Get existingSchedule
  const existingSchedule = useMemo(() => {
    const intervals: DatetimeInterval[] =
      existingTimeSlots?.map((timeslot) => ({
        start: timeslot.begins,
        end: timeslot.ends,
      })) ?? [];
    return toIndividualDates(intervals, { minutes: 15 }, true);
  }, [existingTimeSlots]);

  // States
  const [schedule, setSchedule] = useState<Date[]>([]);
  const [changed, setChanged] = useState(false);

  // Update schedule callback
  const updateSchedule = useCallback(
    (newSchedule: Date[]) => {
      setChanged(!dateArraysEqual(newSchedule, existingSchedule));
      setSchedule(newSchedule);
    },
    [existingSchedule]
  );

  // Save schedule callback
  const scheduleReplace = useReplaceUserTimeslotsIn(eventID);
  const saveTimeSlots = useCallback(async () => {
    await scheduleReplace(schedule, timeZoneTag);
    await Promise.all([refetchSchedule(), refetchAllSchedules()]);
    setChanged(false);
  }, [
    scheduleReplace,
    schedule,
    timeZoneTag,
    refetchSchedule,
    refetchAllSchedules,
  ]);

  // Reset schedule callback
  const resetSchedule = useCallback(() => {
    setSchedule(existingSchedule);
    setChanged(false);
  }, [existingSchedule]);

  // Calls resetSchedule once on first render
  useEffect(() => {
    if (!changed) {
      resetSchedule();
    }
  }, [changed, resetSchedule]);

  // Guard event loading
  if (!event) return null;

  return (
    <div className="relative h-[500px]">
      <div className="absolute left-8 top-4 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineEditCalendar className="text-md" />
        Click or drag to select available time slots
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <TimeslotSavePanel
          changed={changed}
          saveTimeSlots={saveTimeSlots}
          resetSchedule={resetSchedule}
        />
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <TimeslotSelector
          occurringDates={csvToDateArray(event.occuringDays).map((date) =>
            toZonedTime(date, event.timeZone)
          )}
          timeZoneTag={timeZoneTag}
          startTime={event.begins}
          endTime={event.ends}
          schedule={schedule}
          onChange={updateSchedule}
          weekOnly={event.type === "DAYSOFWEEK"}
        />
      </div>
    </div>
  );
};

interface GroupAvailabilityZoneProps {
  eventID: string;
  timeZoneTag: string;
}

export const GroupAvailabilityZone: React.FC<GroupAvailabilityZoneProps> = ({
  eventID,
  timeZoneTag,
}) => {
  // API hooks
  const { data: event } = useEvent(eventID);
  const { data: allTimeSlots } = useAllTimeslotsOf(eventID);
  const { data: participants } = useParticipantsOf(eventID);

  // States
  const [hoveredTime, setHoveredTime] = useState<Date | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);

  // If no time is hovered, load whole schedule
  // Otherwise, load only the schedule of the hovered person
  const filteredParticipants = useMemo(() => {
    return (
      participants?.filter(
        (participant) =>
          !hoveredTime ||
          participant.timeSlots.some((ts) =>
            isBetween(hoveredTime, ts.begins, ts.ends)
          )
      ) ?? []
    );
  }, [participants, hoveredTime]);

  // If no one is hovered, load whole schedule
  // Otherwise, load only the schedule of the hovered person
  const filteredSchedule = useMemo(() => {
    const intervals: DatetimeInterval[] =
      allTimeSlots
        ?.filter(
          (timeslot) =>
            !hoveredPerson || timeslot.participateUserID == hoveredPerson
        )
        .map((timeslot) => ({
          start: timeslot.begins,
          end: timeslot.ends,
        })) ?? [];
    return toIndividualDates(intervals, { minutes: 15 }, true);
  }, [allTimeSlots, hoveredPerson]);

  // Guard event loading
  if (!event) return null;

  return (
    <div className="relative h-[500px]">
      <div className="absolute left-8 top-4 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineMouse className="text-md" />
        Hover on slots to see who is available
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <TimeSlotParticipantsPanel
          participants={filteredParticipants}
          hoveredTime={hoveredTime}
          onHoverPersonChange={setHoveredPerson}
        />
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <TimeslotView
          occurringDates={csvToDateArray(event.occuringDays).map((date) =>
            toZonedTime(date, event.timeZone)
          )}
          timeZoneTag={timeZoneTag}
          startTime={event.begins}
          endTime={event.ends}
          schedule={filteredSchedule}
          maxScheduleCount={participants?.length ?? 1}
          setHoveredTime={setHoveredTime}
          weekOnly={event.type === "DAYSOFWEEK"}
        />
      </div>
    </div>
  );
};
