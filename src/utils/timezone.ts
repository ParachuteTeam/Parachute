// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export const currentTimezone: string =
  Intl.DateTimeFormat().resolvedOptions().timeZone;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
export const availableTimezones: string[] = Intl.supportedValuesOf("timeZone");
