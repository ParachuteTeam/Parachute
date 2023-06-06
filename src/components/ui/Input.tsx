import React, { Fragment, useMemo, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

interface SelectorProps {
  className?: string;
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const Selector: React.FC<SelectorProps> = ({
  className,
  options,
  selectedIndex,
  onChange,
}) => {
  return (
    <div
      className={`rounded-input flex flex-row justify-stretch gap-1 rounded-lg p-0.5 text-sm ${
        className ?? ""
      }`}
    >
      {options.map((option: string, index: number) => (
        <button
          key={index}
          className={`w-full ${
            selectedIndex === index ? "primary-button" : "px-4 py-2 font-medium"
          }`}
          onClick={() => onChange(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export interface ListboxOption {
  label: string;
  value: string;
}

export interface RoundedListboxProps {
  className?: string;
  direction?: "up" | "down";
  options: ListboxOption[];
  value: string;
  onChange: (value: "DAYSOFWEEK" | "DATES") => void;
}

export const RoundedListbox: React.FC<RoundedListboxProps> = ({
  className,
  direction,
  options,
  value,
  onChange,
}) => {
  const selected = options.find((option) => option.value === value);
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={className}>
        <div className="relative">
          <div>
            <Listbox.Button className="rounded-input w-full px-3">
              <div className="flex items-center">
                <div className="block grow truncate text-left">
                  <span>{selected?.label}</span>
                </div>
                <span className="pointer-events-none flex items-center">
                  <HiChevronUpDown className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Listbox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`
                absolute
                z-[1] mt-1 max-h-60 w-full py-1 ${
                  direction === "up" ? "bottom-[45px]" : ""
                }
                overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5
                focus:outline-none
              `}
            >
              {options.map(({ value, label }) => (
                <Listbox.Option
                  key={value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
};

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface RoundedComboboxProps {
  className?: string;
  direction?: "up" | "down";
  options: ListboxOption[];
  value: string;
  onChange: (value: string) => void;
}

export const RoundedCombobox: React.FC<RoundedComboboxProps> = ({
  className,
  direction,
  options,
  value,
  onChange,
}) => {
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(
    () =>
      query === ""
        ? options
        : options.filter((option) => {
            return option.label
              .toLowerCase()
              .includes(query?.toLowerCase() ?? "");
          }),
    [query, options]
  );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className={className}>
        <div className="relative">
          <div className="rounded-input relative pl-3">
            <Combobox.Input
              className="border-none focus:outline-none"
              displayValue={() => selected?.label ?? ""}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-3 flex items-center">
              <HiChevronUpDown className="h-5 w-5" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              className={`
                absolute
                z-[1] mt-1 max-h-60 w-full py-1 ${
                  direction === "up" ? "bottom-[50px]" : ""
                }
                overflow-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5
                focus:outline-none
              `}
            >
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map(({ value, label }) => (
                  <Combobox.Option
                    key={value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </div>
    </Combobox>
  );
};
