import { availableTimezones } from "../../utils/timezone";
import React from "react";
import type { ComboboxOption } from "./Input";
import { RoundedCombobox } from "./Input";
import { getCurrentGMT, getCurrentTimeZoneTag } from "../../utils/date-utils";

interface TimezoneInputProps {
  className?: string;
  direction?: "up" | "down";
  value: string;
  onChange: (value: string) => void;
}

const timezoneOptions: ComboboxOption[] = availableTimezones.map(
  (tz: string) => {
    return {
      label: `${tz} (${getCurrentGMT(tz)})`,
      value: getCurrentTimeZoneTag(tz),
    };
  }
);

export const RoundedTimezoneInput: React.FC<TimezoneInputProps> = ({
  className,
  direction,
  value,
  onChange,
}) => {
  return (
    <RoundedCombobox
      className={className}
      direction={direction}
      options={timezoneOptions}
      value={value}
      onChange={onChange}
    />
  );
};
