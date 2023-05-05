import React, { useMemo } from "react";
import { differenceInDays, format } from "date-fns";
import ScheduleSelector from "react-schedule-selector";
import { toDatetimeIntervals } from "../utils/utils";

const TimeslotBlock: React.FC<{
  selected: boolean;
  datetime: Date;
  opacity?: number;
}> = ({ selected, datetime, opacity = 1 }) => {
  const endOfHour = datetime.getMinutes() == 45;
  const endOfHalfHour = datetime.getMinutes() == 15;
  return (
    // returns div with whole hours thicker than half hours, make half hours dashed
    <div className={`h-4 w-20 border-x border-black`}>
      <div
        className={`h-full w-full border-b ${
          endOfHour
            ? "border-black"
            : endOfHalfHour
            ? "border-dashed border-b-gray-600"
            : "border-b-gray-300"
        }`}
      >
        {selected && (
          <div className="h-full w-full bg-[#79ffe1]" style={{ opacity }} />
        )}
      </div>
    </div>
  );
};

const DateLabel: React.FC<{ datetime: Date; weekOnly?: boolean }> = ({
  datetime,
  weekOnly,
}) => {
  return (
    <div className="flex w-20 flex-col items-center border-b border-black pb-1">
      {!weekOnly && <div className="text-xs">{format(datetime, "MMM d")}</div>}
      <div className="mt-[-4px] text-lg font-bold">
        {format(datetime, "EEE")}
      </div>
    </div>
  );
};

const TimeLabel: React.FC<{ time: Date; showTime: boolean }> = ({
  time,
  showTime,
}) => {
  return (
    <div
      className={
        "relative bottom-[9px] text-right text-xs text-gray-500 " +
        (showTime ? "w-16" : "w-10")
      }
    >
      {showTime && (time.getMinutes() % 30 == 0 ? format(time, "p") : "")}
    </div>
  );
};

interface TimeslotSelectorProps {
  startTime: number;
  endTime: number;
  schedule: Date[];
  occurringDates: Date[];
  onChange?: (newSchedule: Date[]) => void;
  weekOnly?: boolean;
}

export const TimeslotSelector: React.FC<TimeslotSelectorProps> = ({
  occurringDates,
  startTime,
  endTime,
  schedule,
  onChange,
  weekOnly,
}) => {
  // find index of consecutive dates
  const consecutiveDates = toDatetimeIntervals(
    occurringDates,
    { days: 1 },
    false
  );
  return (
    <div className="flex w-fit flex-row">
      {consecutiveDates.map((interval, index) => {
        return (
          <ScheduleSelector
            key={index}
            selection={schedule}
            startDate={interval.start}
            numDays={differenceInDays(interval.end, interval.start) + 1}
            minTime={startTime}
            maxTime={endTime}
            hourlyChunks={4}
            rowGap="0px"
            columnGap="10px"
            renderTimeLabel={(time) => {
              return <TimeLabel time={time} showTime={index == 0} />;
            }}
            renderDateLabel={(datetime) => {
              return <DateLabel datetime={datetime} weekOnly={weekOnly} />;
            }}
            renderDateCell={(datetime, selected) => {
              return <TimeslotBlock selected={selected} datetime={datetime} />;
            }}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
};

interface TimeslotViewProps {
  occurringDates: Date[];
  startTime: number;
  endTime: number;
  schedule: Date[];
  maxScheduleCount: number;
  setHoveredTime?: (time: Date | null) => void;
  weekOnly?: boolean;
}

export const TimeslotView: React.FC<TimeslotViewProps> = ({
  occurringDates,
  startTime,
  endTime,
  schedule,
  maxScheduleCount,
  setHoveredTime,
  weekOnly,
}) => {
  // find index of consecutive dates
  const consecutiveDates = toDatetimeIntervals(
    occurringDates,
    { days: 1 },
    false
  );

  const timeScheduleCounts = useMemo(() => {
    const scheduleCounts: Record<string, number> = {};
    schedule.forEach((date) => {
      const dateStr = date.toJSON();
      if (dateStr in scheduleCounts) {
        scheduleCounts[dateStr] += 1;
      } else {
        scheduleCounts[dateStr] = 1;
      }
    });
    return scheduleCounts;
  }, [schedule]);

  return (
    <div className="flex w-fit flex-row">
      {consecutiveDates.map((interval, index) => {
        return (
          <ScheduleSelector
            key={index}
            selection={[]}
            startDate={interval.start}
            numDays={differenceInDays(interval.end, interval.start) + 1}
            minTime={startTime}
            maxTime={endTime}
            hourlyChunks={4}
            rowGap="0px"
            columnGap="10px"
            renderTimeLabel={(time) => {
              return <TimeLabel time={time} showTime={index == 0} />;
            }}
            renderDateLabel={(datetime) => {
              return <DateLabel datetime={datetime} weekOnly={weekOnly} />;
            }}
            renderDateCell={(datetime) => {
              return (
                <div
                  onMouseEnter={() => setHoveredTime?.(datetime)}
                  onMouseLeave={() => setHoveredTime?.(null)}
                >
                  <TimeslotBlock
                    selected={schedule.some(
                      (date) => date.getTime() == datetime.getTime()
                    )}
                    datetime={datetime}
                    opacity={
                      (timeScheduleCounts[datetime.toJSON()] ?? 0) /
                      maxScheduleCount
                    }
                  />
                </div>
              );
            }}
          />
        );
      })}
    </div>
  );
};
