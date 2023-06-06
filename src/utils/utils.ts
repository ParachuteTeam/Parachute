import { add, addMilliseconds, isEqual } from "date-fns";
import { format, formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { currentTimezone } from "./timezone";

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

const cachedToday = new Date();

export const getCurrentGMT = (timeZone?: string) => {
  return formatInTimeZone(cachedToday, timeZone ?? "", "O");
};

export const getCurrentTimeZoneTag = (timeZone?: string) => {
  return `${timeZone ?? currentTimezone},${getCurrentGMT(timeZone)}`;
};

export const offsetFromTimeZoneTag = (timeZoneTag?: string) => {
  if (timeZoneTag === undefined) {
    return getTimezoneOffset(currentTimezone, new Date());
  }
  const offsetString = timeZoneTag.split("GMT")[1];
  if (offsetString === undefined) {
    return getTimezoneOffset(currentTimezone, new Date());
  }
  return Number(offsetString) * 60 * 60 * 1000;
};

export const getInfoFromTimeZoneTag = (timeZoneTag: string) => {
  const [timeZone, gmt] = timeZoneTag.split(",");
  const offsetString = timeZoneTag.split("GMT")[1];
  return { timeZone, gmt, offset: Number(offsetString) * 60 * 60 * 1000 };
};

export const formatWithTimeZoneTag = (
  time: Date,
  timeZoneTag: string,
  formatStr: string
) => {
  const { timeZone, offset } = getInfoFromTimeZoneTag(timeZoneTag);
  const currentTimezoneOffset = offsetFromTimeZoneTag(currentTimezone);
  return format(
    addMilliseconds(time, offset - currentTimezoneOffset),
    formatStr,
    { timeZone }
  );
};

export const makeTime = (
  plusDay: number,
  hour: number,
  minute: number,
  timeZoneTag?: string
): Date => {
  // Use 1971 to allow timezone shifting to previous day
  const utcTime = Date.UTC(2000, 0, 1 + plusDay, hour, minute, 0);
  return new Date(utcTime - offsetFromTimeZoneTag(timeZoneTag));
};

export const formatTime = (time: Date, timeZoneTag = ""): string => {
  return (
    formatWithTimeZoneTag(time, timeZoneTag, "hh:mm aa") +
    (formatWithTimeZoneTag(time, timeZoneTag, "d") === "2" ? " (+1d)" : "")
  );
};

export const formatTimeIdentifier = (time: Date, timeZoneTag = ""): string => {
  return formatWithTimeZoneTag(time, timeZoneTag, "dd:HH:mm");
};

export const formatTimespan = (
  begins: Date,
  ends: Date,
  timeZoneTag?: string
): string => {
  return `${formatTime(begins, timeZoneTag)}-${formatTime(ends, timeZoneTag)}`;
};

export const formatShortDate = (
  date: Date,
  weekOnly = false,
  timeZoneTag = ""
) => {
  if (weekOnly) {
    return formatWithTimeZoneTag(date, timeZoneTag, "EEE");
  }
  return formatWithTimeZoneTag(date, timeZoneTag, "MMM d");
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

export const formatOccurring = (
  dates: Date[],
  weekOnly: boolean,
  timeZoneTag?: string
): string => {
  return toDatetimeIntervals(dates, { days: 1 }, false)
    .map((span) => {
      if (isEqual(span.start, span.end)) {
        return formatShortDate(span.start, weekOnly, timeZoneTag);
      }
      return `${formatShortDate(
        span.start,
        weekOnly,
        timeZoneTag
      )} - ${formatShortDate(span.end, weekOnly, timeZoneTag)}`;
    })
    .join(", ");
};
