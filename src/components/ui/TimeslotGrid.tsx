import React from "react";
import { differenceInDays } from "date-fns";
import { toDatetimeIntervals, toHourDecimal } from "../../utils/utils";
import { StyledScheduleSelector } from "./StyleScheduleSelector";

interface TimeslotSelectorProps {
  occurringDates: Date[];
  timeLabelTimeZoneTag: string;
  startTime: Date;
  endTime: Date;
  schedule: Date[];
  onChange?: (newSchedule: Date[]) => void;
  weekOnly?: boolean;
}

export const TimeslotSelector: React.FC<TimeslotSelectorProps> = ({
  occurringDates,
  timeLabelTimeZoneTag,
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

  const startTimeDecimal = toHourDecimal(startTime);
  const endTimeDecimal = toHourDecimal(endTime);

  return (
    <div className="flex w-fit flex-row">
      {consecutiveDates.map((interval, index) => {
        return (
          <StyledScheduleSelector
            key={index}
            selection={schedule}
            onSelectionChange={onChange}
            startDate={interval.start}
            numDays={differenceInDays(interval.end, interval.start) + 1}
            minTime={startTimeDecimal}
            maxTime={endTimeDecimal}
            showTime={index == 0}
            showDate={true}
            weekOnly={weekOnly}
            timeLabelTimeZoneTag={timeLabelTimeZoneTag}
          />
        );
      })}
    </div>
  );
};

interface TimeslotViewProps {
  occurringDates: Date[];
  timeLabelTimeZoneTag: string;
  startTime: Date;
  endTime: Date;
  schedule: Date[];
  maxScheduleCount: number;
  setHoveredTime?: (time: Date | null) => void;
  weekOnly?: boolean;
}

export const TimeslotView: React.FC<TimeslotViewProps> = ({
  occurringDates,
  timeLabelTimeZoneTag,
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

  const startTimeDecimal = toHourDecimal(startTime);
  const endTimeDecimal = toHourDecimal(endTime);

  return (
    <div className="flex w-fit flex-row">
      {consecutiveDates.map((interval, index) => {
        return (
          <StyledScheduleSelector
            key={index}
            display={schedule}
            startDate={interval.start}
            numDays={differenceInDays(interval.end, interval.start) + 1}
            minTime={startTimeDecimal}
            maxTime={endTimeDecimal}
            onHoverChange={setHoveredTime}
            showTime={index == 0}
            showDate={true}
            weekOnly={weekOnly}
            displayDepth={maxScheduleCount}
            timeLabelTimeZoneTag={timeLabelTimeZoneTag}
          />
        );
      })}
    </div>
  );
};
