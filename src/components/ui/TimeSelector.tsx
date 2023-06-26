import React, { useCallback, useMemo } from "react";
import { addMinutes, isAfter, isBefore } from "date-fns";
import {
  formatTime,
  formatTimeIdentifier,
  makeTime,
  parseTimeIdentifier,
} from "../../utils/date-utils";
import { RoundedListbox } from "./Input";

export interface TimeSelectorProps {
  className?: string;
  direction?: "up" | "down";
  timeGapMinutes?: number;
  timeZone?: string;
  value: Date;
  onChange?: (value: Date) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  className,
  direction,
  timeGapMinutes,
  timeZone,
  value,
  onChange,
}) => {
  const availableTimes = useMemo(() => {
    const times = [];
    const start = makeTime(0, 0, 0, timeZone);
    const end = makeTime(1, 0, 0, timeZone);
    const gap = timeGapMinutes ?? 30;
    for (let time = start; time <= end; time = addMinutes(time, gap)) {
      times.push(time);
    }
    return times;
  }, [timeGapMinutes, timeZone]);

  const options = useMemo(
    () =>
      availableTimes.map((time) => ({
        label: formatTime(time, timeZone),
        value: formatTimeIdentifier(time, timeZone),
      })),
    [availableTimes, timeZone]
  );

  const valueIdentifier = useMemo(
    () => formatTimeIdentifier(value, timeZone),
    [value, timeZone]
  );

  return (
    <RoundedListbox
      className={className}
      direction={direction}
      options={options}
      value={valueIdentifier}
      onChange={(value) => onChange?.(parseTimeIdentifier(value, timeZone))}
    />
  );
};

export interface TimespanSelectorProps {
  className?: string;
  direction?: "up" | "down";
  timeZone?: string;
  start: Date;
  end: Date;
  onChangeStart?: (start: Date) => void;
  onChangeEnd?: (end: Date) => void;
}

export const TimespanSelector: React.FC<TimespanSelectorProps> = ({
  className,
  direction,
  timeZone,
  start,
  end,
  onChangeStart,
  onChangeEnd,
}) => {
  const onChangeStartInternal = useCallback(
    (newStart: Date) => {
      onChangeStart?.(newStart);
      if (isAfter(newStart, end)) {
        onChangeEnd?.(newStart);
      }
    },
    [end, onChangeStart, onChangeEnd]
  );
  const onChangeEndInternal = useCallback(
    (newEnd: Date) => {
      onChangeEnd?.(newEnd);
      if (isBefore(newEnd, start)) {
        onChangeStart?.(newEnd);
      }
    },
    [start, onChangeStart, onChangeEnd]
  );
  return (
    <div className={`flex flex-row gap-2 text-sm ${className ?? ""}`}>
      <TimeSelector
        className="w-[50%]"
        direction={direction}
        timeZone={timeZone}
        value={start}
        onChange={onChangeStartInternal}
      />
      <TimeSelector
        className="w-[50%]"
        direction={direction}
        timeZone={timeZone}
        value={end}
        onChange={onChangeEndInternal}
      />
    </div>
  );
};
