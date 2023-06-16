import React, { useCallback, useMemo } from "react";
import { addDays, differenceInDays, isEqual } from "date-fns";
import {
  toDatetimeIntervals,
  toHourDecimal,
  toPlusDay,
  toUTCTime,
  toZonedTime,
} from "../../utils/utils";
import { StyledScheduleSelector } from "./StyleScheduleSelector";

const VerticalEllipsis: React.FC = () => (
  <div className="ml-2.5 flex w-14 flex-row items-center justify-center">
    ···
  </div>
);

interface TimeslotGridProps {
  occurringDates: Date[];
  timeZoneTag: string;
  startTime: Date;
  endTime: Date;

  selection?: Date[];
  display?: Date[];

  onSelectionChange?: (newSelection: Date[]) => void;
  onHoverChange?: (hovered: Date | null) => void;

  weekOnly?: boolean;
  displayDepth?: number;
}

export const TimeslotGrid: React.FC<TimeslotGridProps> = ({
  occurringDates,
  timeZoneTag,
  startTime,
  endTime,

  selection,
  display,

  onSelectionChange,
  onHoverChange,

  weekOnly,
  displayDepth,
}) => {
  const consecutiveDates = useMemo(
    () => toDatetimeIntervals(occurringDates, { days: 1 }, false),
    [occurringDates]
  );

  // Converted selection and display
  const convertedSelection = useMemo(
    () => selection?.map((date) => toZonedTime(date, timeZoneTag)),
    [selection, timeZoneTag]
  );
  const convertedDisplay = useMemo(
    () => display?.map((date) => toZonedTime(date, timeZoneTag)),
    [display, timeZoneTag]
  );
  const handleSelectionChange = useCallback(
    (newSelection: Date[]) => {
      onSelectionChange?.(
        newSelection.map((date) => toUTCTime(date, timeZoneTag))
      );
    },
    [onSelectionChange, timeZoneTag]
  );
  const handleHoverChange = useCallback(
    (hovered: Date | null) => {
      onHoverChange?.(hovered ? toUTCTime(hovered, timeZoneTag) : null);
    },
    [onHoverChange, timeZoneTag]
  );

  // Start time and end time information
  const startTimeDecimal = toHourDecimal(startTime, timeZoneTag);
  const startTimePlusDay = toPlusDay(startTime, timeZoneTag);
  const endTimeDecimal = toHourDecimal(endTime, timeZoneTag);
  const endTimePlusDay = toPlusDay(endTime, timeZoneTag);
  const sameDay = startTimePlusDay === endTimePlusDay || endTimeDecimal === 0;

  // Fill in some props to simplify rendering afterwards
  const renderScheduleSelector = useCallback(
    (
      index: number,
      startDate: Date,
      numDays: number,
      minTime: number,
      maxTime: number,
      showTime: boolean,
      dateRenderMode: "DATE" | "ELLIPSE" | "NONE",
      disabled: boolean
    ) => {
      return (
        <div>
          <StyledScheduleSelector
            key={index}
            selection={convertedSelection}
            display={convertedDisplay}
            onSelectionChange={handleSelectionChange}
            onHoverChange={handleHoverChange}
            startDate={startDate}
            numDays={numDays}
            minTime={minTime}
            maxTime={maxTime}
            showTime={showTime}
            dateRenderMode={dateRenderMode}
            weekOnly={weekOnly}
            displayDepth={displayDepth}
            disabled={disabled}
          />
        </div>
      );
    },
    [
      convertedDisplay,
      convertedSelection,
      displayDepth,
      handleHoverChange,
      handleSelectionChange,
      weekOnly,
    ]
  );

  const renderDateRange = useCallback(
    (
      index: number,
      startDate: Date,
      endDate: Date,
      renderEllipsis: boolean
    ) => {
      // number of full days
      const numDays = differenceInDays(endDate, startDate) + 1;

      // cached dates
      const offsetStartDate = addDays(startDate, startTimePlusDay);
      const offsetEndDate = addDays(endDate, endTimePlusDay);

      if (sameDay) {
        return (
          <div key={index} className="flex flex-row">
            {renderEllipsis && <VerticalEllipsis />}
            {renderScheduleSelector(
              index,
              offsetStartDate,
              numDays,
              startTimeDecimal,
              endTimeDecimal === 0 ? 24 : endTimeDecimal,
              index == 0,
              "DATE",
              false
            )}
          </div>
        );
      } else {
        return (
          <div key={index} className="flex flex-col">
            <div className="flex flex-row">
              {renderEllipsis && <VerticalEllipsis />}
              {renderScheduleSelector(
                -1,
                offsetStartDate,
                1,
                0,
                endTimeDecimal,
                index === 0,
                "DATE",
                true
              )}
              {renderScheduleSelector(
                index + 0.5,
                addDays(offsetStartDate, 1),
                numDays,
                0,
                endTimeDecimal,
                false,
                "DATE",
                false
              )}
            </div>
            <div className="flex flex-row">
              {renderEllipsis && <VerticalEllipsis />}
              {renderScheduleSelector(
                index,
                offsetStartDate,
                numDays,
                startTimeDecimal,
                24,
                index === 0,
                "ELLIPSE",
                false
              )}
              {renderScheduleSelector(
                occurringDates.length,
                offsetEndDate,
                1,
                startTimeDecimal,
                24,
                false,
                "ELLIPSE",
                true
              )}
            </div>
          </div>
        );
      }
    },
    [
      endTimeDecimal,
      endTimePlusDay,
      occurringDates.length,
      renderScheduleSelector,
      sameDay,
      startTimeDecimal,
      startTimePlusDay,
    ]
  );

  return (
    <div className="flex w-fit flex-row">
      {consecutiveDates.map((interval, index) => {
        const shouldRenderEllipsis =
          index > 0 &&
          (sameDay ||
            !isEqual(
              addDays(consecutiveDates[index - 1]?.end ?? 0, 2),
              interval.start
            ));
        return renderDateRange(
          index,
          interval.start,
          interval.end,
          shouldRenderEllipsis
        );
      })}
    </div>
  );
};

interface TimeslotSelectorProps {
  occurringDates: Date[];
  timeZoneTag: string;
  startTime: Date;
  endTime: Date;
  schedule: Date[];
  onChange?: (newSchedule: Date[]) => void;
  weekOnly?: boolean;
}

export const TimeslotSelector: React.FC<TimeslotSelectorProps> = ({
  occurringDates,
  timeZoneTag,
  startTime,
  endTime,
  schedule,
  onChange,
  weekOnly,
}) => {
  return (
    <TimeslotGrid
      occurringDates={occurringDates}
      timeZoneTag={timeZoneTag}
      startTime={startTime}
      endTime={endTime}
      selection={schedule}
      onSelectionChange={onChange}
      weekOnly={weekOnly}
    />
  );
};

interface TimeslotViewProps {
  occurringDates: Date[];
  timeZoneTag: string;
  startTime: Date;
  endTime: Date;
  schedule: Date[];
  maxScheduleCount: number;
  setHoveredTime?: (time: Date | null) => void;
  weekOnly?: boolean;
}

export const TimeslotView: React.FC<TimeslotViewProps> = ({
  occurringDates,
  timeZoneTag,
  startTime,
  endTime,
  schedule,
  maxScheduleCount,
  setHoveredTime,
  weekOnly,
}) => {
  return (
    <TimeslotGrid
      occurringDates={occurringDates}
      timeZoneTag={timeZoneTag}
      startTime={startTime}
      endTime={endTime}
      display={schedule}
      displayDepth={maxScheduleCount}
      onHoverChange={setHoveredTime}
      weekOnly={weekOnly}
    />
  );
};
