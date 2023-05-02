import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import React from "react";
import { api } from "../utils/api";
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineSearch,
} from "react-icons/md";
import { useSession } from "next-auth/react";
import { EventTypeTag } from "../components/Tag";
import type { ListboxOption } from "../components/Input";
import { RoundedListbox, Selector } from "../components/Input";
import Link from "next/link";
import { DateSelect } from "../components/DateSelect";

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
    value: "DAYSOFWEEK",
  },
  {
    label: "Specific days",
    value: "DATES",
  },
];

const StartNewEventSection = () => {
  const router = useRouter();
  const [eventName, setEventName] = React.useState("");
  const [timezone, setTimezone] = React.useState("");
  const [timespanStart, setTimespanStart] = React.useState("");
  const [timespanEnd, setTimespanEnd] = React.useState("");
  const [selectDaysType, setSelectDaysType] = React.useState<
    "DAYSOFWEEK" | "DATES"
  >("DAYSOFWEEK");
  const [selectedDays, setSelectedDays] = React.useState<Date[]>([]);

  const { data: session } = useSession();
  const email = session?.user.email as string;
  const mutation = api.events.createEvent.useMutation();

  const handleCreateEvent = () => {
    // Save the event details to the database, and update the Event model.

    const newEvent = mutation.mutate(
      {
        occuringDays: selectedDays.toString(),
        name: eventName,
        begins: new Date().toISOString(),
        ends: new Date().toISOString(),
        type: selectDaysType,
        email: email,
        address: "",
        timeZone: timezone,
      },
      {
        onSuccess: (data) => {
          const joinCode = data.joinCode; // Extract joinCode from the data object
          void router.push(`/event/${joinCode}`).then(() => {
            // Additional logic can be placed here, if required.
          });
        },
      }
    );
    // Redirect to the event page with the generated event ID.
  };

  return (
    <>
      <div className="input-field">
        <label>Event name</label>
        <input
          placeholder="New Meeting"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div className="input-field">
        <label>Timezone</label>
        <input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
      </div>
      <div className="input-field">
        <label>Select days</label>
        <RoundedListbox
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
        <div className="flex flex-row gap-2">
          <input
            className="w-[50%]"
            value={timespanStart}
            onChange={(e) => setTimespanStart(e.target.value)}
          />
          <input
            className="w-[50%]"
            value={timespanEnd}
            onChange={(e) => setTimespanEnd(e.target.value)}
          />
        </div>
      </div>
      <button
        className="primary-button mt-3 py-3"
        onClick={() => void handleCreateEvent()}
      >
        Create Event
      </button>
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
      <div className="flex justify-center px-12 py-8">
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
