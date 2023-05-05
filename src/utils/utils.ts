import { add, format, isEqual } from "date-fns";

export const isBetween = (date: Date, start: Date, end: Date): boolean => {
  return (
    isEqual(date, start) || isEqual(date, end) || (date > start && date < end)
  );
};

export const toHourDecimal = (date: Date): number => {
  return date.getHours() + date.getMinutes() / 60;
};

export const csvToDateArray = (csv: string): Date[] => {
  return csv.split(",").map((s) => new Date(s));
};

export const formatTime = (time: Date): string => {
  return format(time, "hh:mm aa") + (time.getDay() === 2 ? " (+1d)" : "");
};

export const formatTimespan = (begins: Date, ends: Date): string => {
  return `${formatTime(begins)}-${formatTime(ends)}`;
};

export const formatShortDate = (date: Date, weekOnly = false) => {
  if (weekOnly) {
    return format(date, "EEE");
  }
  return format(date, "MMM d");
};

export interface DatetimeInterval {
  start: Date;
  end: Date;
}

export const toDatetimeIntervals = (
  dates: Date[],
  step: Duration,
  exclusiveIntervals: boolean
): DatetimeInterval[] => {
  // Sort dates and remove duplicates
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  for (let i = 1; i < sortedDates.length; i++) {
    if (isEqual(sortedDates[i - 1] ?? 0, sortedDates[i] ?? 1)) {
      sortedDates.splice(i, 1);
      i--;
    }
  }

  // Handle empty case
  const firstDate = sortedDates[0];
  if (firstDate === undefined) {
    return [];
  }

  // Group dates into spans
  const intervals: DatetimeInterval[] = [];
  let currentSpan: DatetimeInterval = { start: firstDate, end: firstDate };
  for (const d of sortedDates.slice(1)) {
    if (isEqual(add(currentSpan.end, step), d)) {
      currentSpan.end = d;
    } else {
      if (exclusiveIntervals) {
        currentSpan.end = add(currentSpan.end, step);
      }
      intervals.push(currentSpan);
      currentSpan = { start: d, end: d };
    }
  }
  if (exclusiveIntervals) {
    currentSpan.end = add(currentSpan.end, step);
  }
  intervals.push(currentSpan);

  return intervals;
};

export const toIndividualDates = (
  intervals: DatetimeInterval[],
  step: Duration,
  exclusiveIntervals: boolean
): Date[] => {
  const dates: Date[] = [];
  for (const interval of intervals) {
    let current = interval.start;
    while (current < interval.end) {
      dates.push(current);
      current = add(current, step);
    }
    if (!exclusiveIntervals && isEqual(current, interval.end)) {
      dates.push(current);
    }
  }
  return dates;
};

export const formatOccurring = (dates: Date[], weekOnly: boolean): string => {
  return toDatetimeIntervals(dates, { days: 1 }, false)
    .map((span) => {
      if (isEqual(span.start, span.end)) {
        return formatShortDate(span.start, weekOnly);
      }
      return `${formatShortDate(span.start, weekOnly)} - ${formatShortDate(
        span.end,
        weekOnly
      )}`;
    })
    .join(", ");
};
