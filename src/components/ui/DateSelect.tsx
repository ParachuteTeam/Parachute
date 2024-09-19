import React, { useCallback, useMemo } from "react";
import { addDays, format, isAfter, isEqual, startOfToday } from "date-fns";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";

const isBetween = (
  date: Date,
  start: Date | null,
  end: Date | null
): boolean => {
  if (!start || !end) {
    return false;
  }
  if (isAfter(start, end)) {
    return isBetween(date, end, start);
  }
  return (
    isEqual(date, start) ||
    isEqual(date, end) ||
    (isAfter(date, start) && isAfter(end, date))
  );
};

const iterateDaysBetween = (
  start: Date,
  end: Date,
  action: (date: Date) => void
) => {
  if (isAfter(start, end)) {
    iterateDaysBetween(end, start, action);
  }
  let current = start;
  while (isAfter(end, current) || isEqual(end, current)) {
    action(current);
    current = addDays(current, 1);
  }
};

interface DateSelectProps {
  week?: boolean;
  value?: Date[];
  onChange?: (value: Date[]) => void;
}

export const DateSelect: React.FC<DateSelectProps> = ({
  week,
  value,
  onChange,
}) => {
  const [currentDate, setCurrentDate] = React.useState(startOfToday());

  const firstDayOfWeek = addDays(currentDate, -currentDate.getDay());
  const firstDay = addDays(firstDayOfWeek, -14);
  const lastDay = addDays(firstDayOfWeek, 20);

  const valueCopy = useMemo(() => value?.slice() ?? [], [value]);

  const [selectionStart, setSelectionStart] = React.useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = React.useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = React.useState<
    "select" | "deselect"
  >("select");

  const shouldAppearSelected = useCallback(
    (date: Date) => {
      const selected = valueCopy.some((d) => isEqual(d, date));
      const between = isBetween(date, selectionStart, selectionEnd);
      return (
        (selected || between) && !(selectionMode === "deselect" && between)
      );
    },
    [valueCopy, selectionStart, selectionEnd, selectionMode]
  );

  const prevShouldAppearSelected = useCallback(
    (date: Date) => {
      const prev = addDays(date, -1);
      return shouldAppearSelected(prev);
    },
    [shouldAppearSelected]
  );

  const nextShouldAppearSelected = useCallback(
    (date: Date) => {
      const next = addDays(date, 1);
      return shouldAppearSelected(next);
    },
    [shouldAppearSelected]
  );

  const endSelection = useCallback(() => {
    if (selectionStart && selectionEnd) {
      iterateDaysBetween(selectionStart, selectionEnd, (d) => {
        const idx = valueCopy.findIndex((v) => isEqual(v, d));
        if (selectionMode === "select") {
          if (idx === -1) {
            valueCopy.push(d);
          }
        }
        if (selectionMode === "deselect") {
          if (idx !== -1) {
            valueCopy.splice(idx, 1);
          }
        }
      });
      onChange?.(valueCopy);
    }
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [selectionStart, selectionEnd, selectionMode, valueCopy, onChange]);

  if (week) {
    return (
      <div className="grid select-none grid-cols-7" onMouseLeave={endSelection}>
        {Array.from({ length: 7 })
          .map((_, i) => addDays(firstDayOfWeek, i))
          .map((date) => {
            const appearSelected = shouldAppearSelected(date);
            const prevSelected =
              date.getDay() !== 0 && prevShouldAppearSelected(date);
            const nextSelected =
              date.getDay() !== 6 && nextShouldAppearSelected(date);
            return (
              <div
                key={date.toISOString()}
                className="py-0.5"
                onMouseDown={() => {
                  setSelectionStart(date);
                  setSelectionEnd(date);
                  setSelectionMode(
                    valueCopy.some((d) => isEqual(d, date))
                      ? "deselect"
                      : "select"
                  );
                }}
                onMouseUp={endSelection}
                onMouseEnter={() => {
                  if (selectionStart) {
                    setSelectionEnd(date);
                  }
                }}
              >
                <div
                  className={`flex aspect-square flex-col justify-center text-center text-sm ${
                    appearSelected ? "rounded-full bg-black" : ""
                  } ${prevSelected ? "rounded-l-none" : ""} ${
                    nextSelected ? "rounded-r-none" : ""
                  }`}
                >
                  {appearSelected ? (
                    <div className="text-white">{format(date, "EEE")}</div>
                  ) : (
                    <div>{format(date, "EEE")}</div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div
      className="grid select-none grid-cols-7 py-2"
      onMouseLeave={endSelection}
    >
      <div className="col-span-7 mb-2 flex flex-row items-center justify-center gap-3 text-xs">
        <div className="text-center font-semibold">
          {format(firstDay, "MMM yyyy")}-{format(lastDay, "MMM yyyy")}
        </div>
      </div>
      <div
        className="col-span-7 mb-1 flex cursor-pointer flex-row items-center justify-center text-xs"
        onClick={() => setCurrentDate(addDays(currentDate, -7))}
      >
        <MdOutlineKeyboardDoubleArrowUp />
      </div>
      {Array.from({ length: 7 })
        .map((_, i) => addDays(firstDay, i))
        .map((date) => (
          <div
            key={date.toISOString()}
            className="py-0.5 text-center text-xs font-semibold"
          >
            {format(date, "EEE")}
          </div>
        ))}
      {Array.from({ length: 7 * 5 })
        .map((_, i) => addDays(firstDay, i))
        .map((date) => {
          const appearSelected = shouldAppearSelected(date);
          const prevSelected =
            date.getDay() !== 0 && prevShouldAppearSelected(date);
          const nextSelected =
            date.getDay() !== 6 && nextShouldAppearSelected(date);
          return (
            <div
              key={date.toISOString()}
              className="py-0.5"
              onMouseDown={() => {
                setSelectionStart(date);
                setSelectionEnd(date);
                setSelectionMode(
                  valueCopy.some((d) => isEqual(d, date))
                    ? "deselect"
                    : "select"
                );
              }}
              onMouseUp={endSelection}
              onMouseEnter={() => {
                if (selectionStart) {
                  setSelectionEnd(date);
                }
              }}
            >
              <div
                className={`flex aspect-square flex-col justify-center text-center ${
                  appearSelected ? "rounded-full bg-black" : ""
                } ${prevSelected ? "rounded-l-none" : ""} ${
                  nextSelected ? "rounded-r-none" : ""
                }`}
              >
                {appearSelected ? (
                  <>
                    <div className="-mb-1 text-xs text-white">
                      {format(date, "MMM")}
                    </div>
                    <div className="text-white">{date.getDate()}</div>
                  </>
                ) : (
                  <>
                    <div className="-mb-1 text-xs text-gray-500">
                      {format(date, "MMM")}
                    </div>
                    <div>{date.getDate()}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      <div
        className="col-span-7 flex cursor-pointer flex-row items-center justify-center text-xs"
        onClick={() => setCurrentDate(addDays(currentDate, 7))}
      >
        <MdOutlineKeyboardDoubleArrowDown />
      </div>
    </div>
  );
};
