import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { MdOutlineAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import { EventTypeTag } from "../../components/Tag";
import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { RoundedListbox } from "../../components/Input";

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

const AvailibilityZone: React.FC = () => {
  return <div className="h-[500px]"></div>;
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
              <AvailibilityZone />
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
              <AvailibilityZone />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

const EventPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Navbar />
      <EventInfoHeader />
      <OperationCard />
    </div>
  );
};

export default EventPage;
