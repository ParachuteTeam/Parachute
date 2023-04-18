import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineEditCalendar,
  MdOutlineFileDownloadDone,
} from "react-icons/md";
import { HiOutlineGlobe } from "react-icons/hi";
import { EventTypeTag } from "../../components/Tag";
import React, { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { RoundedListbox } from "../../components/Input";
import ScheduleSelector from "react-schedule-selector";
import { format } from "date-fns";
import { signIn, useSession } from "next-auth/react";

const EventInfoHeader: React.FC = () => {
  return (
    <div className="flex w-full flex-row justify-center border-t border-gray-200 bg-white px-12 py-6">
      <div className="flex max-w-[1200px] flex-1 flex-row items-center gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-row items-center gap-1 text-sm text-gray-500">
            <MdOutlineCalendarToday />
            <div>Sun, Wed, Thu</div>
            <MdOutlineAccessTime className="ml-1" />
            <div>12:00 PM - 1:00 PM</div>
          </div>
          <div className="text-3xl font-semibold">CS 222 Group Meeting</div>
          <div className="flex flex-row items-center gap-2 text-sm">
            <EventTypeTag>My Event</EventTypeTag>
            <p>No one filled yet</p>
            <p>
              <span className="font-bold">Event ID:</span> 123456
            </p>
            <p>
              <span className="font-bold">Link:</span>{" "}
              https://parachute.fyi/event/123456
            </p>
          </div>
        </div>
        <div className="flex w-[200px] flex-col gap-3 text-sm font-light">
          <button className="rounded-button">Edit</button>
          <button className="danger-button">Delete</button>
        </div>
      </div>
    </div>
  );
};

const OperationCardTab: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <div
          className={`
            mb-[-1px] cursor-pointer border-b-2 pb-3 focus:outline-none
            ${
              selected
                ? "border-black text-center"
                : "border-transparent text-center font-light text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700"
            }
            ${className ?? ""}
            `}
        >
          {children}
        </div>
      )}
    </Tab>
  );
};

const MyAvailabilityZone: React.FC = () => {
  const [schedule, setSchedule] = useState<Date[]>([]);
  console.log(schedule);
  return (
    <div className="relative flex h-[500px]">
      <div className="absolute top-4 left-8 flex flex-row items-center gap-1 bg-white text-sm text-gray-500">
        <MdOutlineEditCalendar className="text-md" />
        Click or drag to select available time slots
      </div>
      <div className="absolute right-8 flex h-full flex-row items-center">
        <div className="card flex h-36 w-64 flex-col items-center justify-center shadow-lg">
          <MdOutlineFileDownloadDone className="text-5xl text-gray-500" />
          <div className="mt-1 text-lg font-bold">File Saved</div>
          <div className="text-[12px] font-light text-gray-500">
            Availability is up to date
          </div>
        </div>
      </div>
      <div className="h-full w-full flex-row items-center overflow-auto px-32 py-20">
        <div className="w-fit">
          <ScheduleSelector
            selection={schedule}
            numDays={5}
            minTime={8}
            maxTime={22}
            hourlyChunks={4}
            rowGap="0px"
            columnGap="10px"
            renderTimeLabel={(time) => {
              return (
                <div className="relative bottom-[9px] w-16 text-right text-xs text-gray-500">
                  {time.getMinutes() % 30 == 0 ? format(time, "p") : ""}
                </div>
              );
            }}
            renderDateLabel={(datetime) => {
              return (
                <div className="flex w-20 flex-col items-center border-b border-black pb-1">
                  <div className="text-xs">{format(datetime, "MMM d")}</div>
                  <div className="mt-[-4px] text-lg font-bold">
                    {format(datetime, "EEE")}
                  </div>
                </div>
              );
            }}
            renderDateCell={(datetime, selected) => {
              return (
                <div
                  className={`h-6 w-20 border border-t-0 border-black ${
                    selected ? "bg-black" : ""
                  }`}
                />
              );
            }}
            onChange={setSchedule}
          />
        </div>
      </div>
    </div>
  );
};

const OperationCard: React.FC = () => {
  return (
    <div className="flex flex-row justify-center p-6">
      <div className="card max-w-[1248px] flex-1 p-0">
        <Tab.Group>
          <Tab.List className="flex w-full flex-row gap-4 border-b border-gray-300 px-6 pt-4">
            <OperationCardTab className="w-[120px]">
              My Availability
            </OperationCardTab>
            <OperationCardTab className="w-[140px]">
              Group Availability
            </OperationCardTab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <MyAvailabilityZone />
              <div className="flex flex-row gap-2 border-t border-gray-300 px-6 py-4 text-sm">
                <div className="flex grow flex-col gap-1">
                  <p className="font-semibold">My timezone</p>
                  <p className="font-light">
                    All time and availability information are displayed for this
                    timezone
                  </p>
                </div>
                <RoundedListbox
                  className="rounded-input w-[300px] text-sm"
                  direction="up"
                  options={[{ label: "Chicago (GMT-8)", value: "gmt-8" }]}
                  value="gmt-8"
                  onChange={() => void 1}
                />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <MyAvailabilityZone />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

const LogInCard: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-row justify-center p-6 pt-16">
      <div className="flex h-[65vh] max-w-[50vw] flex-1 items-center justify-center rounded-lg border-[1px] border-gray-300">
        <div className="my-10 flex h-full w-full flex-col">
          <div className="flex w-full flex-col border-b-[1px] border-gray-300 p-5">
            <div className="flex flex-row items-center gap-1 text-sm text-gray-500">
              <MdOutlineCalendarToday />
              <div>Sun, Wed, Thu</div>
              <MdOutlineAccessTime className="ml-1" />
              <div>12:00 PM - 1:00 PM</div>
              <HiOutlineGlobe className="ml-1" />
              <div>Chicago (GMT+8)</div>
            </div>
            <div className="mt-4 text-3xl font-bold text-black">
              CS 222 Group Meeting
            </div>
            <div className="mt-2 text-base font-normal text-black">
              3 people filled
            </div>
          </div>
          <div className="h-full w-full">
            <div className="flex h-full w-full flex-row items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-sm font-light text-gray-600">
                  Sign in to join event
                </div>
                <button
                  onClick={() => void signIn("google")}
                  className="w-full rounded-lg bg-black p-3 px-10 text-center font-semibold text-white"
                >
                  Sign in with Google
                </button>
                <button
                  onClick={() => void signIn("auth0")}
                  className="w-full rounded-lg border p-3 px-10 text-center font-semibold"
                >
                  Sign in with Auth0
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  void id;

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <></>;
  }

  if (!session) {
    return (
      <div className="min-h-screen w-screen">
        <Navbar />
        <LogInCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Navbar />
      <EventInfoHeader />
      <OperationCard />
    </div>
  );
};

export default EventPage;
