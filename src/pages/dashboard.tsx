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
import { RoundedListbox, Selector } from "../components/Input";
import Link from "next/link";

const EventCard = () => {
  return (
    <Link
      className="card mb-4 flex flex-col gap-1 p-5 hover:ring-2 hover:ring-gray-300"
      href="/dashboard"
    >
      <div className="flex flex-row items-center gap-1 text-sm text-gray-500">
        <MdOutlineCalendarToday />
        <div>Sun, Wed, Thu</div>
        <MdOutlineAccessTime className="ml-1" />
        <div>12:00 PM - 1:00 PM</div>
      </div>
      <div className="text-2xl font-semibold">CS 222 Group Meeting</div>
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
  return (
    <>
      <div className="input-field">
        <label>Event name</label>
        <input placeholder="New Meeting" />
      </div>
      <div className="input-field">
        <label>Timezone</label>
        <input />
      </div>
      <div className="input-field">
        <label>Select days</label>
        <RoundedListbox
          options={selectDaysOptions}
          value={selectDaysType}
          onChange={setSelectDaysType}
        />
      </div>
      <div className="input-field">
        <label>Timespan</label>
        <div className="flex flex-row gap-2">
          <input className="w-[50%]" />
          <input className="w-[50%]" />
        </div>
      </div>
      <button className="primary-button mt-3 py-3">Create Event</button>
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
        <input placeholder="xxxxxx" />
      </div>
      <button className="primary-button mt-3 py-3">Join Event</button>
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
