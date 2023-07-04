import React, { useMemo } from "react";
import { format } from "date-fns";
import ScheduleSelector from "react-schedule-selector";
import { formatTimeWithoutDay } from "../../utils/date-utils";

const TimeslotBlock: React.FC<{
  selected: boolean;
  datetime: Date;
  disabled?: boolean;
  opacity?: number;
}> = ({ selected, datetime, disabled, opacity = 1 }) => {
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
        {disabled ? (
          <div className="h-full w-full bg-gray-500" />
        ) : (
          selected && (
            <div className="h-full w-full bg-[#79ffe1]" style={{ opacity }} />
          )
        )}
      </div>
    </div>
  );
};

const DateLabel: React.FC<{
  datetime: Date;
  weekOnly?: boolean;
}> = ({ datetime, weekOnly }) => {
  return (
    <div className="flex w-20 flex-col items-center border-b border-black pb-1">
      {!weekOnly && <div className="text-xs">{format(datetime, "MMM d")}</div>}
      <div className="mt-[-4px] text-lg font-bold">
        {format(datetime, "EEE")}
      </div>
    </div>
  );
};

const TimeLabel: React.FC<{
  time: Date;
}> = ({ time }) => {
  return (
    <div className="relative bottom-[9px] w-16 text-right text-xs text-gray-500">
      {time.getMinutes() % 30 == 0 ? formatTimeWithoutDay(time) : ""}
    </div>
  );
};

interface StyledScheduleSelectorProps {
  startDate: Date;
  numDays: number;
  minTime: number;
  maxTime: number;

  selection?: Date[];
  display?: Date[];

  onSelectionChange?: (newSelection: Date[]) => void;
  onHoverChange?: (hovered: Date | null) => void;

  disabled?: boolean;
  showTime: boolean;
  dateRenderMode: "DATE" | "ELLIPSE" | "NONE";
  weekOnly?: boolean;
  displayDepth?: number;
}

export const StyledScheduleSelector: React.FC<StyledScheduleSelectorProps> = ({
  startDate,
  numDays,
  minTime,
  maxTime,

  selection,
  display,

  onSelectionChange,
  onHoverChange,

  disabled,
  showTime,
  dateRenderMode,
  weekOnly,
  displayDepth,
}) => {
  const timeToDisplayCount = useMemo(() => {
    const displayCount: Record<string, number> = {};
    display?.forEach((date) => {
      const dateStr = date.toJSON();
      if (dateStr in displayCount) {
        displayCount[dateStr] += 1;
      } else {
        displayCount[dateStr] = 1;
      }
    });
    return displayCount;
  }, [display]);

  return (
    <ScheduleSelector
      selection={disabled ? [] : selection ?? []}
      onChange={disabled ? undefined : onSelectionChange}
      startDate={startDate}
      numDays={numDays}
      minTime={minTime}
      maxTime={maxTime}
      hourlyChunks={4}
      rowGap="0px"
      columnGap="10px"
      renderTimeLabel={(time) => {
        if (showTime) {
          return <TimeLabel time={time} />;
        }
        return <div />;
      }}
      renderDateLabel={(datetime) => {
        if (dateRenderMode === "DATE") {
          return <DateLabel datetime={datetime} weekOnly={weekOnly} />;
        }
        if (dateRenderMode === "ELLIPSE") {
          return (
            <div className="flex h-20 w-20 flex-row items-center justify-center border-b border-black">
              ···
            </div>
          );
        }
        return <div />;
      }}
      renderDateCell={(datetime, selected) => {
        return (
          <div
            onMouseEnter={() => onHoverChange?.(datetime)}
            onMouseLeave={() => onHoverChange?.(null)}
          >
            <TimeslotBlock
              selected={
                selected ||
                (display ?? []).some(
                  (date) => date.getTime() == datetime.getTime()
                )
              }
              datetime={datetime}
              disabled={disabled}
              opacity={
                display
                  ? (timeToDisplayCount[datetime.toJSON()] ?? 0) /
                    (displayDepth ?? 1)
                  : 1
              }
            />
          </div>
        );
      }}
    />
  );
};
