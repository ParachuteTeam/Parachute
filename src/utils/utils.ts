import { addDays, format, isEqual } from "date-fns";

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

interface DateSpan {
  start: Date;
  end: Date;
}

export const formatOccurring = (dates: Date[], weekOnly: boolean): string => {
  // Sort dates and extract the first date
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const firstDate = sortedDates[0];
  if (firstDate === undefined) {
    return "";
  }

  // Group dates into spans
  const daySpans: DateSpan[] = [];
  let currentSpan: DateSpan = { start: firstDate, end: firstDate };
  for (const d of dates.slice(1)) {
    if (isEqual(addDays(currentSpan.end, 1), d)) {
      currentSpan.end = d;
    } else {
      daySpans.push(currentSpan);
      currentSpan = { start: d, end: d };
    }
  }
  daySpans.push(currentSpan);

  // Format spans
  return daySpans
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
