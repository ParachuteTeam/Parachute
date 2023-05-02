import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { MdOutlineAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import { HiOutlineGlobe } from "react-icons/hi";
import { EventTypeTag } from "../../components/Tag";
import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { RoundedTimezoneInput } from "../../components/Input";
import {
  GroupAvailabilityZone,
  MyAvailabilityZone,
} from "../../components/AvailabilityZone";
import { useSession } from "next-auth/react";
import {
  Auth0LoginButton,
  GoogleLoginButton,
} from "../../components/LoginButton";
import { currentTimezone } from "../../utils/timezone";
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react'
import { api } from "../../utils/api";
const EventInfoHeader: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const deleteEvent = api.events.deleteEvent.useMutation();
  const editEventName = api.events.updateEvent_name.useMutation();

  const [eventName, setEventName] = useState("");

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
            <div className="mb-0.5 text-3xl font-semibold">
              CS 222 Group Meeting
            </div>
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
            <button className="rounded-button" onClick={handleEditClick}>Edit</button>
            <button className="danger-button" onClick={handleDeleteClick}>Delete</button>
          </div>
        </div>
        <Transition show={isDeleteDialogOpen} as={Fragment}>
          <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              open={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              </Transition.Child>
              <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
              >
            </span>
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-lg p-6 my-space-x-8 transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 text-left"
                  >
                    Confirm deletion
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-2xl font-bold text-left">
                    CS 222 Group Meeting
                  </Dialog.Description>
                  <Dialog.Description className="mt-2 text-sm text-gray-500">
                    The event will be permanently deleted, including all availability data. This action is irreversible and can not be undone.
                  </Dialog.Description>
                  <div className="mt-4 flex mx-auto justify-center gap-4">
                    <button
                        className="w-60 inline-flex justify-center rounded-md border border-grey-200 bg-transparent px-4 py-2 text-sm font-medium text-black-900 hover:bg-black-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                        className="w-60 px-4 py-2 text-sm danger-button"
                        onClick={() => {
                          deleteEvent.mutate({
                            host_email: 'haiyuezhang63@gmail.com',
                            eventId: '568b0bed-63c6-4296-8e98-0c74e30f3391'
                          });
                          setIsDeleteDialogOpen(false);
                        }}
                    >
                      Permanently Delete
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        <Transition show={isEditDialogOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              </Transition.Child>
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
            </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-space-x-8 transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 text-left"
                  >
                    Edit Event Name
                  </Dialog.Title>
                  <div className="mt-4" />
                  <Dialog.Title
                    as="h3"
                    className="text-sm font-bold leading-6 text-gray-900 text-left"
                  >
                    Event Name
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm text-gray-500">
                    <input
                      type="text"
                      className="border border-gray-250 p-3 rounded-md w-full"
                      style={{ paddingRight: "10px" }}
                      placeholder="Enter Event Name Here..."
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </Dialog.Description>
                  <div className="mt-3" />
                  <Dialog.Title
                    as="h3"
                    className="text-xs leading-4 text-gray-600 text-left"
                  >
                    You can only edit event name after creating the event. To change occurring days and time span, delete the event and create a new one.
                  </Dialog.Title>
                  <div className="mt-4 flex mx-auto justify-center gap-4">
                    <button
                      className="w-60 inline-flex justify-center rounded-md border border-grey-200 bg-transparent px-4 py-2 text-sm font-medium text-black-900 hover:bg-black-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-60 px-4 py-2 text-sm danger-button bg-black"
                      onClick={() => {
                        if (!eventName) {
                          alert("Empty EventName is Not Allowed.");
                          return;
                        }
                        editEventName.mutate({
                          host_email: 'haiyuezhang63@gmail.com',
                          name: eventName,
                          eventId: '568b0bed-63c6-4296-8e98-0c74e30f3391'
                        });
                        setIsEditDialogOpen(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
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

const OperationCard: React.FC = () => {
  const [timezone, setTimezone] = React.useState(currentTimezone);
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
            </Tab.Panel>
            <Tab.Panel>
              <GroupAvailabilityZone />
            </Tab.Panel>
          </Tab.Panels>
          <div className="flex w-full flex-row gap-2 rounded-b-md border-t border-gray-300 bg-white px-6 py-4 text-sm">
            <div className="flex grow flex-col gap-1">
              <p className="font-semibold">My timezone</p>
              <p className="font-light">
                All time and availability information are displayed for this
                timezone
              </p>
            </div>
            <RoundedTimezoneInput
              className="w-[300px] px-0"
              direction="up"
              value={timezone}
              onChange={setTimezone}
            />
          </div>
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
                <GoogleLoginButton />
                <Auth0LoginButton />
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
