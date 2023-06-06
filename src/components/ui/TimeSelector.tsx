import React, { useCallback, useMemo } from "react";
import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";
import { formatTime } from "../../utils/utils";
import { RoundedListbox } from "./Input";

export interface TimeSelectorProps {
  className?: string;
  direction?: "up" | "down";
  timeGapMinutes?: number;
  timeStart?: Date;
  timeEnd?: Date;
  value: Date;
  onChange?: (value: Date) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  className,
  direction,
  timeGapMinutes,
  timeStart,
  timeEnd,
  value,
  onChange,
}) => {
  const availableTimes = useMemo(() => {
    const times = [];
    const start = timeStart ?? new Date(0, 0, 1, 0, 0, 0);
    const end = timeEnd ?? new Date(0, 0, 2, 0, 0, 0);
    const gap = timeGapMinutes ?? 30;
    for (let time = start; time <= end; time = addMinutes(time, gap)) {
      times.push(time);
    }
    return times;
  }, [timeGapMinutes, timeStart, timeEnd]);

  return (
    <RoundedListbox
      className={className}
      direction={direction}
      options={availableTimes.map((time) => ({
        label: formatTime(time),
        value: format(time, "dd:HH:mm"),
      }))}
      value={format(value, "dd:HH:mm")}
      onChange={(value) => onChange?.(parse(value, "dd:HH:mm", new Date()))}
    />
  );
};

export interface TimespanSelectorProps {
  className?: string;
  direction?: "up" | "down";
  start: Date;
  end: Date;
  onChangeStart?: (start: Date) => void;
  onChangeEnd?: (end: Date) => void;
}

export const TimespanSelector: React.FC<TimespanSelectorProps> = ({
  className,
  direction,
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
        value={start}
        onChange={onChangeStartInternal}
      />
      <TimeSelector
        className="w-[50%]"
        direction={direction}
        value={end}
        onChange={onChangeEndInternal}
      />
    </div>
  );
};
