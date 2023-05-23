import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../components/section/Navbar";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineSearch,
} from "react-icons/md";
import { useSession } from "next-auth/react";
import { EventTypeTag } from "../components/ui/Tag";
import type { ListboxOption } from "../components/ui/Input";
import {
  RoundedListbox,
  Selector,
  RoundedTimezoneInput,
  TimespanSelector,
} from "../components/ui/Input";
import Link from "next/link";
import { DateSelect } from "../components/ui/DateSelect";
import { currentTimezone } from "../utils/timezone";
import { formatOccurring, formatTime } from "../utils/utils";
import { ButtonWithState } from "../components/ui/Button";
import { AiOutlineClose } from "react-icons/ai";

interface Event {
  id: string;
  name?: string;
  occuringDays?: string;
  joinCode: string;
  begins: Date;
  ends: Date;
  type?: string;

  ownerID?: string;
  // Add other properties as needed
}
interface EventCardProps {
  event: Event;
  myEvent: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, myEvent }) => {
  const eventId = event.id;
  const eventName = event.name;
  const occurringDaysArray = event.occuringDays
    ?.split(",")
    .map((s) => new Date(s));

  return (
    <Link
      className="card mb-4 flex flex-col gap-1 p-5 hover:ring-2 hover:ring-gray-300"
      href={`/event/${eventId}`}
    >
      <div className="flex flex-row items-center gap-1 text-xs text-gray-500 md:text-sm">
        <div className="flex flex-row items-center gap-1">
          <MdOutlineCalendarToday />
          <div>
            {formatOccurring(
              occurringDaysArray ?? [],
              event.type === "DAYSOFWEEK"
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <MdOutlineAccessTime className="ml-1" />
          <div>
            {formatTime(event.begins)} - {formatTime(event.ends)}
          </div>
        </div>
      </div>
      <div className="mb-0.5 text-xl font-semibold">{eventName}</div>
      <div className="flex flex-row items-center gap-2 text-sm">
        {myEvent && <EventTypeTag>My Event</EventTypeTag>}
        <div>Click to see detail</div>
      </div>
    </Link>
  );
};

const EventList = () => {
  const { data: participatedEvents } =
    api.participates.getParticipateEvents.useQuery();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredEvents = participatedEvents?.filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="event-list-container">
      <div className="card mb-4 flex flex-row items-center px-4 text-sm">
        <MdOutlineSearch className="mr-2 text-lg text-gray-500" />
        <input
          className="h-full w-full py-4 focus:outline-none"
          placeholder="Search for an event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredEvents?.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          myEvent={event.ownerID === session?.user.id}
        />
      ))}
    </div>
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
  const [timezone, setTimezone] = React.useState(currentTimezone);
  const [startTime, setStartTime] = React.useState<Date>(
    new Date(0, 0, 1, 8, 0, 0)
  );
  const [endTime, setEndTime] = React.useState<Date>(
    new Date(0, 0, 1, 22, 0, 0)
  );
  const [selectDaysType, setSelectDaysType] = React.useState<
    "DAYSOFWEEK" | "DATES"
  >("DAYSOFWEEK");
  const [selectedDays, setSelectedDays] = React.useState<Date[]>([]);

  const { data: session } = useSession();
  const email = session?.user.email as string;
  const createEvent = api.events.createEvent.useMutation();

  const handleCreateEvent = () => {
    // Save the event details to the database, and update the Event model.

    createEvent.mutate(
      {
        occuringDays: selectedDays.toString(),
        name: eventName,
        begins: startTime.toISOString(),
        ends: endTime.toISOString(),
        type: selectDaysType,
        email: email,
        address: "",
        timeZone: timezone,
      },
      {
        onSuccess: (data) => {
          const eventId = data.id; // Extract joinCode from the data object
          void router.push(`/event/${eventId}`).then(() => {
            // Additional logic can be placed here, if required.
          });
        },
      }
    );
    // Redirect to the event page with the generated event ID.
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
          start={startTime}
          end={endTime}
          onChangeStart={setStartTime}
          onChangeEnd={setEndTime}
        />
      </div>
      <ButtonWithState
        className="primary-button mt-3 py-3 text-sm"
        loadingClassName="primary-button-loading mt-3 py-3 text-sm"
        loading={createEvent.isLoading}
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
  const { data: event } = api.events.getEventjoinCode.useQuery({
    joinCode: joinCode,
  });

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
      <button
        className="primary-button mt-3 py-3 text-sm"
        onClick={handleJoinEvent}
      >
        Join Event
      </button>
    </>
  );
};

const eventOptions = ["Start New", "Join Existing"];

const NewEventCard = () => {
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

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const [showWizard, setShowWizard] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // REVIEW: could use a global state management lib like jotai

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 768);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(window.innerWidth < 768);
      });
    };
  }, []);

  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    void router.push("/");
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center px-4 py-8 md:px-12">
        <div className="flex h-full w-full max-w-[1200px] flex-row gap-8">
          <div className="flex h-full flex-grow flex-col">
            <div className="mb-6 flex flex-row items-center justify-between">
              <div className="text-2xl font-bold">Recent Events</div>
              <div
                className="primary-button cursor-pointer md:hidden"
                onClick={() => setShowWizard(!showWizard)}
              >
                new/join
              </div>
            </div>
            <EventList />
          </div>
          {!isMobile ? (
            <div className="flex h-full flex-col">
              <div className="mb-6 text-2xl font-bold">Add Event</div>
              <NewEventCard />
            </div>
          ) : (
            showWizard && (
              <div
                className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-row items-center justify-center bg-black bg-opacity-50 p-4"
                onClick={() => setShowWizard(false)}
              >
                <NewEventCard />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
