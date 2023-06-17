import type { ListboxOption } from "../ui/Input";
import { RoundedListbox, Selector } from "../ui/Input";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getCurrentTimeZoneTag, makeTime, moveTime } from "../../utils/utils";
import { RoundedTimezoneInput } from "../ui/TimezoneInput";
import { DateSelect } from "../ui/DateSelect";
import { TimespanSelector } from "../ui/TimeSelector";
import { ButtonWithState } from "../ui/Button";
import { useCreateEvent, useEventWithJoinCode } from "../../utils/api-hooks";

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

  console.log(startTime, endTime);

  // <<< Form values <<<

  const canSubmit = eventName.length > 0 && selectedDays.length > 0;

  const { mutateAsync: createEvent, isLoading: creatingEvent } =
    useCreateEvent();
  const handleCreateEvent = async () => {
    const { id: eventId } = await createEvent({
      occuringDays: selectedDays.toString(),
      name: eventName,
      begins: startTime.toISOString(),
      ends: endTime.toISOString(),
      type: selectDaysType,
      timeZone: timeZoneTag,
    });
    await router.push(`/event/${eventId}`);
  };

  return (
    <>
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
        loading={creatingEvent}
        disabled={!canSubmit}
        onClick={() => void handleCreateEvent()}
      >
        Create Event
      </ButtonWithState>
      <div className="text-center text-xs text-gray-400">
        Timezone, days and time span cannot be <br />
        changed after the event is created
      </div>
    </>
  );
};

const JoinExistingEventSection = () => {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const { data: event, isLoading } = useEventWithJoinCode(joinCode);

  const handleJoinEvent = () => {
    const eventId = event?.id;
    if (eventId) {
      void router.push(`/event/${eventId}`);
    }
  };

  return (
    <>
      <div className="input-field">
        <label>Event code</label>
        <text>Ask the host to provide the 6-digit event code</text>
        <input
          className="rounded-input"
          placeholder="xxxxxx"
          maxLength={6}
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
      </div>
      <ButtonWithState
        className="primary-button mt-3 py-3 text-sm"
        loadingClassName="primary-button-loading mt-3 py-3 text-sm"
        disabledClassName="rounded-button-disabled mt-3 py-3 text-sm"
        loading={joinCode.length > 0 && isLoading}
        disabled={!event}
        onClick={handleJoinEvent}
      >
        Join Event
      </ButtonWithState>
    </>
  );
};

const eventOptions = ["Start New", "Join Existing"];

export const NewEventCard = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <div
      className="card flex w-[400px] flex-col gap-3 px-8 py-6"
      onClick={(e) => e.stopPropagation()}
    >
      <Selector
        className="mb-2"
        options={eventOptions}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      />
      {selectedIndex === 0 && <StartNewEventSection />}
      {selectedIndex === 1 && <JoinExistingEventSection />}
    </div>
  );
};
