import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import React from "react";
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineSearch,
} from "react-icons/md";
import { EventTypeTag } from "../components/Tag";
import type { ListboxOption } from "../components/Input";
import {
  RoundedListbox,
  Selector,
  RoundedTimezoneInput,
  TimespanSelector,
} from "../components/Input";
import Link from "next/link";
import { DateSelect } from "../components/DateSelect";
import { currentTimezone } from "../utils/timezone";

const EventCard = () => {
  return (
    <Link
      className="card mb-4 flex flex-col gap-1 p-5 hover:ring-2 hover:ring-gray-300"
      href="/event/1"
    >
      <div className="flex flex-row items-center gap-1 text-sm text-gray-500">
        <MdOutlineCalendarToday />
        <div>Sun, Wed, Thu</div>
        <MdOutlineAccessTime className="ml-1" />
        <div>12:00 PM - 1:00 PM</div>
      </div>
      <div className="mb-0.5 text-xl font-semibold">CS 222 Group Meeting</div>
      <div className="flex flex-row items-center gap-2 text-sm">
        <EventTypeTag>My Event</EventTypeTag>
        <div>No one filled yet</div>
      </div>
    </Link>
  );
};

const selectDaysOptions: ListboxOption[] = [
  {
    label: "Days of week",
    value: "days-of-week",
  },
  {
    label: "Specific days",
    value: "specific-days",
  },
];

const StartNewEventSection = () => {
  const [selectDaysType, setSelectDaysType] = React.useState("days-of-week");
  const [selectedDays, setSelectedDays] = React.useState<Date[]>([]);
  const [timezone, setTimezone] = React.useState(currentTimezone);
  const [startTime, setStartTime] = React.useState<Date>(
    new Date(0, 0, 0, 8, 0, 0)
  );
  const [endTime, setEndTime] = React.useState<Date>(
    new Date(0, 0, 0, 22, 0, 0)
  );
  return (
    <>
      <div className="input-field text-sm">
        <label>Event name</label>
        <input className="rounded-input" placeholder="New Meeting" />
      </div>
      <div className="input-field text-sm">
        <label>Timezone</label>
        <RoundedTimezoneInput
          className="px-0 text-sm"
          value={timezone}
          onChange={setTimezone}
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
      {selectDaysType === "days-of-week" && (
        <>
          <div className="input-field">
            <label>Days of week</label>
            <text>Click or drag on days to select</text>
          </div>
          <DateSelect week value={selectedDays} onChange={setSelectedDays} />
        </>
      )}
      {selectDaysType === "specific-days" && (
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
          start={startTime}
          end={endTime}
          onChangeStart={setStartTime}
          onChangeEnd={setEndTime}
        />
      </div>
      <button className="primary-button mt-3 py-3 text-sm">Create Event</button>
      <div className="text-center text-xs text-gray-400">
        Timezone, days and time span cannot be <br />
        changed after the event is created
      </div>
    </>
  );
};

const JoinExistingEventSection = () => {
  return (
    <>
      <div className="input-field">
        <label>Event code</label>
        <text>Ask the host to provide the 6-digit event code</text>
        <input className="rounded-input" placeholder="xxxxxx" />
      </div>
      <button className="primary-button mt-3 py-3 text-sm">Join Event</button>
    </>
  );
};

const eventOptions = ["Start New", "Join Existing"];

const NewEventCard = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <div className="card flex w-[400px] flex-col gap-3 px-8 py-6">
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

const Dashboard: NextPage = () => {
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center py-8 px-12">
        <div className="flex h-full w-full max-w-[1200px] flex-row gap-8">
          <div className="flex h-full flex-grow flex-col">
            <div className="mb-6 text-2xl font-bold">Recent Events</div>
            <div className="card mb-4 flex flex-row items-center px-4 text-sm">
              <MdOutlineSearch className="mr-2 text-lg text-gray-500" />
              <input
                className="h-full w-full py-4 focus:outline-none"
                placeholder="Search for an event name..."
              />
            </div>
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
          <div className="flex h-full flex-col">
            <div className="mb-6 text-2xl font-bold">Add Event</div>
            <NewEventCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
