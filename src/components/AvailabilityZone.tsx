import React, { useEffect, useState } from "react";
import { add, format } from "date-fns";
import {
  MdOutlineEditCalendar,
  MdOutlineFileDownloadDone,
  MdOutlineMouse,
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoEarthSharp } from "react-icons/io5";
import { api } from "../utils/api";
import { TimeslotSelector } from "./TimeslotSelector";

export const MyAvailabilityZone: React.FC<{
  occurringDaysArray: Date[];
  eventID: string;
}> = ({ occurringDaysArray, eventID }) => {
  const [schedule, setSchedule] = useState<Date[]>([]);
  const [changed, setChanged] = useState(false);

  const updateSchedule = (newSchedule: Date[]) => {
    setSchedule(newSchedule);
    setChanged(true);
  };

  const { data: existingSchedule } = api.timeslots.getAllTimeSlots.useQuery({
    eventID: eventID,
  });
  const resetSchedule = () => {
    setSchedule(
      existingSchedule?.map((timeslot) => new Date(timeslot.begins)) ?? []
    );
    setChanged(false);
  };
  useEffect(resetSchedule, [existingSchedule]);

  const scheduleReplace = api.timeslots.timeslotsReplace.useMutation();
  const saveTimeSlots = () => {
    scheduleReplace.mutate(
      {
        eventID: eventID,
        timeslots: schedule.map((timeslot) => ({
          begins: timeslot.toJSON(),
          ends: add(timeslot, { minutes: 15 }).toJSON(),
        })),
      },
      {
        onSuccess: () => {
          setChanged(false);
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
        <div className="flex w-fit flex-row">
          <TimeslotSelector
            isInteractable
            occuringDates={occurringDaysArray}
            startTime={8}
            endTime={20}
            schedule={schedule}
            setSchedule={updateSchedule}
            setHoveredTime={() => void 0}
          />
        </div>
      </div>
    </div>
  );
};

const AvailablePerson: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <div className="font-semibold">{name}</div>
      <IoEarthSharp className="text-md ml-2 text-gray-500" />
      <div className="text-gray-500">Chicago (GMT-8)</div>
    </div>
  );
};

export const GroupAvailabilityZone: React.FC<{
  occurringDaysArray: Date[];
  eventID: string;
}> = ({ occurringDaysArray, eventID }) => {
  const schedule = api.timeslots.getAllTimeSlots_Event.useQuery({
    eventID: eventID,
  });
  console.log(schedule.data);
  // turn schedule.data into an array of dates
  const scheduleDates = schedule.data?.map((timeslot) => {
    return new Date(timeslot.begins);
  });

  const participates = api.events.getAllParticipants.useQuery({
    eventId: eventID,
  });

  const [hoveredTime, setHoveredTime] = useState<Date | null>(null);
  return (
    <div className="relative h-[500px]">
      <div className="absolute left-8 top-4 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineMouse className="text-md" />
        Hover on slots to see who is available
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <div className="card flex h-96 w-96 flex-col items-start justify-start gap-3 p-6 text-sm shadow-lg">
          {hoveredTime ? (
            <>
              <div className="mb-6 text-xs text-gray-500">
                People available on {format(hoveredTime, "EEEEEEE")} from{" "}
                {format(hoveredTime, "p")} to{" "}
                {format(add(hoveredTime, { minutes: 15 }), "p")}:
              </div>
              {schedule.data
                ?.filter((timeslot) => {
                  return timeslot.begins.toJSON() == hoveredTime.toJSON();
                })
                .map((timeslot) => {
                  return (
                    <AvailablePerson
                      key={timeslot.id}
                      name={timeslot.participateUserID ?? ""}
                    />
                  );
                })}
            </>
          ) : (
            <>
              <div className="mb-6 text-xs text-gray-500">
                All people filled (hover to see their availability):
              </div>
              <AvailablePerson name={"John Doe"} />
              <AvailablePerson name={"Raymond Wu"} />
              <AvailablePerson name={"Max Zhang"} />
            </>
          )}
        </div>
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <div className="flex w-fit flex-row">
          <TimeslotSelector
            isInteractable={false}
            occuringDates={occurringDaysArray}
            startTime={8}
            endTime={20}
            schedule={scheduleDates ?? []}
            setHoveredTime={setHoveredTime}
          />
        </div>
      </div>
    </div>
  );
};
