import { availableTimezones } from "../../utils/timezone";
import React from "react";
import type { ComboboxOption } from "./Input";
import { RoundedCombobox } from "./Input";

interface TimezoneInputProps {
  className?: string;
  direction?: "up" | "down";
  value: string;
  onChange: (value: string) => void;
}

const timezoneOptions: ComboboxOption[] = availableTimezones.map(
  (tz: string) => ({ label: tz, value: tz })
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
