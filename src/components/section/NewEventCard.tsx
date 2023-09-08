import type { ListboxOption } from "../ui/Input";
import { RoundedListbox, Selector } from "../ui/Input";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import {
  getCurrentTimeZoneTag,
  makeTime,
  moveTime,
} from "../../utils/date-utils";
import { RoundedTimezoneInput } from "../ui/TimezoneInput";
import { DateSelect } from "../ui/DateSelect";
import { TimespanSelector } from "../ui/TimeSelector";
import { ButtonWithState } from "../ui/Button";
import { useCreateEvent, useEventWithJoinCode } from "../../utils/api-hooks";
import { useDebouncedValue } from "../../utils/hooks";
import { Tab } from "@headlessui/react";

const selectDaysOptions: ListboxOption[] = [
  {
    label: "Days of week",
    value: "DAYSOFWEEK",
  },
  {
    label: "Specific days",
    value: "DATES",
  },
];

const StartNewEventSection = () => {
  const router = useRouter();

  // >>> Form values >>>
  const [eventName, setEventName] = React.useState("");
  const [timeZoneTag, setTimeZoneTag] = React.useState(getCurrentTimeZoneTag());
  const [selectDaysType, setSelectDaysType] = React.useState<
    "DAYSOFWEEK" | "DATES"
  >("DAYSOFWEEK");
  const [selectedDays, setSelectedDays] = React.useState<Date[]>([]);
  const [startTime, setStartTime] = React.useState<Date>(
    makeTime(0, 8, 0, timeZoneTag)
  );
  const [endTime, setEndTime] = React.useState<Date>(
    makeTime(0, 22, 0, timeZoneTag)
  );

  // <<< Form values <<<

  const canSubmit = eventName.trim().length > 0 && selectedDays.length > 0;

  const { mutateAsync: createEvent } = useCreateEvent();
  const handleCreateEvent = async () => {
    const { id: eventId } = await createEvent({
      occuringDays: selectedDays.toString(),
      name: eventName.trim(),
      begins: startTime.toISOString(),
      ends: endTime.toISOString(),
      type: selectDaysType,
      timeZone: timeZoneTag,
    });
    await router.push(`/event/${eventId}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="input-field text-sm">
        <label>Event name</label>
        <input
          className="rounded-input"
          placeholder="New Meeting"
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div className="input-field text-sm">
        <label>Time zone</label>
        <RoundedTimezoneInput
          className="px-0 text-sm"
          value={timeZoneTag}
          onChange={(newTimeZoneTag) => {
            setStartTime(moveTime(startTime, timeZoneTag, newTimeZoneTag));
            setEndTime(moveTime(endTime, timeZoneTag, newTimeZoneTag));
            setTimeZoneTag(newTimeZoneTag);
          }}
        />
      </div>
      <div className="input-field text-sm">
        <label>Select days</label>
        <RoundedListbox
          className="px-0 text-sm"
          options={selectDaysOptions}
          value={selectDaysType}
          onChange={(value) => {
            setSelectedDays([]);
            setSelectDaysType(value);
          }}
        />
      </div>
      {selectDaysType === "DAYSOFWEEK" && (
        <>
          <div className="input-field">
            <label>Days of week</label>
            <text>Click or drag on days to select</text>
          </div>
          <DateSelect week value={selectedDays} onChange={setSelectedDays} />
        </>
      )}
      {selectDaysType === "DATES" && (
        <>
          <div className="input-field">
            <label>Dates</label>
            <text>Click or drag on dates to select</text>
          </div>
          <DateSelect value={selectedDays} onChange={setSelectedDays} />
        </>
      )}
      <div className="input-field">
        <label>Timespan</label>
        <TimespanSelector
          timeZone={timeZoneTag}
          start={startTime}
          end={endTime}
          onChangeStart={setStartTime}
          onChangeEnd={setEndTime}
        />
      </div>
      <ButtonWithState
        className="primary-button mt-3 py-3 text-sm"
        loadingClassName="primary-button-loading mt-3 py-3 text-sm"
        disabledClassName="rounded-button-disabled mt-3 py-3 text-sm"
        disabled={!canSubmit}
        onClick={handleCreateEvent}
      >
        Create Event
      </ButtonWithState>
      <div className="text-center text-xs text-gray-400">
        Timezone, days and time span cannot be <br />
        changed after the event is created
      </div>
    </div>
  );
};

const JoinExistingEventSection = () => {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  const debouncedJoinCode = useDebouncedValue(joinCode, 100);
  const { data: event, isLoading } = useEventWithJoinCode(debouncedJoinCode);

  const handleJoinEvent = () => {
    const eventId = event?.id;
    if (eventId) {
      void router.push(`/event/${eventId}`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="input-field">
        <label>Event code</label>
        <text>
          {debouncedJoinCode.length === 6 && !isLoading && !event
            ? "Event not found!"
            : "Ask the host to provide the 6-digit event code"}
        </text>
        <input
          className="rounded-input"
          inputMode="numeric"
          placeholder="xxxxxx"
          maxLength={6}
          value={joinCode}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setJoinCode(value);
            }
          }}
        />
      </div>
      <ButtonWithState
        className="primary-button mt-3 py-3 text-sm"
        loadingClassName="primary-button-loading mt-3 py-3 text-sm"
        disabledClassName="rounded-button-disabled mt-3 py-3 text-sm"
        loading={joinCode.length === 6 && isLoading}
        disabled={!event}
        onClick={handleJoinEvent}
      >
        Join Event
      </ButtonWithState>
    </div>
  );
};

const TabButton: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <div
          className={`w-full cursor-pointer text-center focus:outline-none ${
            selected ? "primary-button" : "px-4 py-2 font-medium"
          }`}
        >
          {children}
        </div>
      )}
    </Tab>
  );
};

export const NewEventCard = () => {
  return (
    <Tab.Group>
      <div
        className="card flex w-[400px] flex-col gap-3 px-8 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <Tab.List
          className={`rounded-input mb-2 flex flex-row justify-stretch gap-1 rounded-lg p-0.5 text-sm`}
        >
          <TabButton>Start New</TabButton>
          <TabButton>Join Existing</TabButton>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <StartNewEventSection />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <JoinExistingEventSection />
          </Tab.Panel>
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};
