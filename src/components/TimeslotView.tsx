import React from "react";
import { add, format } from "date-fns";
import ScheduleSelector from "react-schedule-selector";

const TimeslotBlock: React.FC<{ selected: boolean; datetime: Date }> = ({
  selected,
  datetime,
}) => {
  return (
    // returns div with whole hours thicker than half hours, make half hours dotted
    <div
      className={`h-4 w-20 border border-t-0 border-black ${
        datetime.getMinutes() == 45
          ? "border-black"
          : datetime.getMinutes() == 15
          ? "border-b-gray-500"
          : "border-b-gray-300"
      } ${selected ? "bg-[#79ffe1]" : ""}`}
    />
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
  occuringDates: Date[];
  startTime: number;
  endTime: number;
  schedule: Date[];
  onChange?: (newSchedule: Date[]) => void;
  setHoveredTime: React.Dispatch<React.SetStateAction<Date | null>>;
  isInteractable: boolean;
  weekOnly?: boolean;
}

export const TimeslotView: React.FC<TimeslotSelectorProps> = ({
  occuringDates,
  startTime,
  endTime,
  schedule,
  onChange,
  setHoveredTime,
  isInteractable,
  weekOnly,
}) => {
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
              return <TimeLabel time={time} showTime={dateIndex == 0} />;
            }}
            renderDateLabel={(datetime) => {
              return <DateLabel datetime={datetime} weekOnly={weekOnly} />;
            }}
            renderDateCell={(datetime, selected) => {
              return isInteractable ? (
                <TimeslotBlock selected={selected} datetime={datetime} />
              ) : (
                <div
                  onMouseEnter={() => setHoveredTime(datetime)}
                  onMouseLeave={() => setHoveredTime(null)}
                >
                  <TimeslotBlock selected={selected} datetime={datetime} />
                </div>
              );
            }}
            onChange={isInteractable ? onChange : () => void 0}
          />
        );
      })}
    </>
  );
};
