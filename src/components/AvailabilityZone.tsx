import React, { useState } from "react";
import { add, format } from "date-fns";
import {
  MdOutlineEditCalendar,
  MdOutlineFileDownloadDone,
  MdOutlineMouse,
} from "react-icons/md";
import ScheduleSelector from "react-schedule-selector";
import { IoEarthSharp } from "react-icons/io5";

const TimeslotBlock: React.FC<{ selected: boolean }> = ({ selected }) => {
  return (
    <div
      className={`h-4 w-20 border border-t-0 border-black ${
        selected ? "bg-black" : ""
      }`}
    />
  );
};

const DateLabel: React.FC<{ datetime: Date }> = ({ datetime }) => {
  return (
    <div className="flex w-20 flex-col items-center border-b border-black pb-1">
      <div className="text-xs">{format(datetime, "MMM d")}</div>
      <div className="mt-[-4px] text-lg font-bold">
        {format(datetime, "EEE")}
      </div>
    </div>
  );
};

const TimeLabel: React.FC<{ time: Date }> = ({ time }) => {
  return (
    <div className="relative bottom-[9px] w-16 text-right text-xs text-gray-500">
      {time.getMinutes() % 30 == 0 ? format(time, "p") : ""}
    </div>
  );
};

export const MyAvailabilityZone: React.FC = () => {
  const [schedule, setSchedule] = useState<Date[]>([]);
  console.log(schedule.sort());
  return (
    <div className="relative h-[500px]">
      <div className="absolute top-4 left-8 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineEditCalendar className="text-md" />
        Click or drag to select available time slots
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <div className="card flex h-36 w-64 flex-col items-center justify-center shadow-lg">
          <MdOutlineFileDownloadDone className="text-5xl text-gray-500" />
          <div className="mt-1 text-lg font-bold">File Saved</div>
          <div className="text-[12px] font-light text-gray-500">
            Availability is up to date
          </div>
        </div>
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <div className="flex w-fit flex-row">
          <Parachute_ScheduleSelector
            occuringDates={[
              new Date(2022, 8, 30),
              new Date(2022, 9, 2),
              new Date(2022, 9, 6),
              new Date(2022, 9, 10),
              new Date(2022, 9, 11),
            ]}
            startTime={8}
            endTime={20}
            schedule={schedule}
            setSchedule={setSchedule}
          />
        </div>
      </div>
    </div>
  );
};

const Parachute_ScheduleSelector: React.FC<{
  occuringDates: Date[];
  startTime: number;
  endTime: number;
  schedule: Date[];
  setSchedule: React.Dispatch<React.SetStateAction<Date[]>>;
}> = ({ occuringDates, startTime, endTime, schedule, setSchedule }) => {
  // find index of consecutive dates
  const consecutiveDates = occuringDates.reduce((acc, date, index, arr) => {
    if (index == 0) {
      acc.push(index);
      return acc;
    }
    // checks for consecutive index
    if (
      add(arr[index - 1] ?? new Date(), { days: 1 }).getDate() != date.getDate()
    ) {
      console.log(date);
      acc.push(index);
    }
    return acc;
  }, [] as number[]);
  return (
    <>
      {consecutiveDates.map((dateIndex, index, arr) => {
        const length = occuringDates.length;
        return (
          <ScheduleSelector
            key={index}
            selection={schedule}
            startDate={
              dateIndex == 0 ? occuringDates[0] : occuringDates[dateIndex]
            }
            numDays={
              index == arr.length - 1
                ? length - dateIndex
                : (arr[index + 1] ?? length) - dateIndex
            }
            minTime={startTime}
            maxTime={endTime}
            hourlyChunks={4}
            rowGap="0px"
            columnGap="10px"
            renderTimeLabel={(time) => {
              return dateIndex == 0 ? (
                <TimeLabel time={time} />
              ) : (
                <TimeLabel time={new Date("")} />
              );
            }}
            renderDateLabel={(datetime) => {
              return <DateLabel datetime={datetime} />;
            }}
            renderDateCell={(_, selected) => {
              return <TimeslotBlock selected={selected} />;
            }}
            onChange={setSchedule}
          />
        );
      })}
    </>
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

export const GroupAvailabilityZone: React.FC = () => {
  const [hoveredTime, setHoveredTime] = useState<Date | null>(null);
  return (
    <div className="relative h-[500px]">
      <div className="absolute top-4 left-8 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
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
              <AvailablePerson name={"John Doe"} />
              <AvailablePerson name={"Raymond Wu"} />
              <AvailablePerson name={"Max Zhang"} />
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
        <div className="w-fit">
          <ScheduleSelector
            selection={[]}
            numDays={5}
            minTime={8}
            maxTime={22}
            hourlyChunks={4}
            rowGap="0px"
            columnGap="10px"
            renderTimeLabel={(time) => {
              return <TimeLabel time={time} />;
            }}
            renderDateLabel={(datetime) => {
              return <DateLabel datetime={datetime} />;
            }}
            renderDateCell={(datetime) => {
              return (
                <div
                  onMouseEnter={() => setHoveredTime(datetime)}
                  onMouseLeave={() => setHoveredTime(null)}
                >
                  <TimeslotBlock selected={false} />
                </div>
              );
            }}
            onChange={() => void 0}
          />
        </div>
      </div>
    </div>
  );
};
