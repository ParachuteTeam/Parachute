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
import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import { api } from "../../utils/api";
import { useEffect } from 'react'

interface EditDialogProps {
  isOpen: boolean;
  close: () => void;
  eventName: string;
  onSubmit: (eventName: string) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  close,
  eventName,
  onSubmit,
}) => {
  const [newEventName, setNewEventName] = useState(eventName);
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => close()}
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
          ></span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-space-x-8 inline-block w-[400px] transform rounded-xl bg-white p-7 shadow-xl transition-all">
              <Dialog.Title className="text-left text-xl font-semibold leading-6 text-gray-900">
                Edit Event Name
              </Dialog.Title>
              <div className="input-field mt-5 text-left">
                <label>Event Name</label>
                <input
                  type="text"
                  className="rounded-input text-sm"
                  placeholder="Enter event name here..."
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                />
                <div className="text-left text-xs text-gray-500">
                  You can only edit event name after creating the event. <br />
                  To change occurring days and time span, delete the event and
                  create a new one.
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-4">
                <button
                  className="rounded-button w-[50%] text-sm"
                  onClick={() => close()}
                >
                  Cancel
                </button>
                <button
                  className="primary-button-with-hover w-[50%] text-sm font-normal"
                  onClick={() => {
                    if (!newEventName) {
                      alert("Empty EventName is Not Allowed.");
                      return;
                    }
                    onSubmit(newEventName);
                    close();
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
  );
};

interface DeleteDialogProps {
  isOpen: boolean;
  close: () => void;
  eventName: string;
  onSubmit: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  close,
  eventName,
  onSubmit,
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => close()}
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
          ></span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-space-x-8 inline-block w-[450px] max-w-lg transform rounded-xl bg-white p-6 shadow-xl transition-all">
              <Dialog.Title className="text-left text-lg font-semibold leading-6 text-gray-900">
                Confirm Delete Event
              </Dialog.Title>
              <div className="mt-4 text-left text-2xl font-bold">
                {eventName}
              </div>
              <div className="mt-2 text-left text-xs text-gray-500">
                The event will be permanently deleted, including all
                availability data. This action is irreversible and can not be
                undone.
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="rounded-button w-[50%] text-sm"
                  onClick={() => close()}
                >
                  Cancel
                </button>
                <button
                  className="danger-button w-[50%] text-sm"
                  onClick={() => {
                    onSubmit();
                    close();
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
  );
};

const EventInfoHeader: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteEvent = api.events.deleteEvent.useMutation();
  const editEventName = api.events.updateEvent_name.useMutation();

  const [email, setEmail] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

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
          <button
            className="rounded-button"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </button>
          <button
            className="danger-button"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <EditDialog
        isOpen={isEditDialogOpen}
        close={() => setIsEditDialogOpen(false)}
        eventName={"CS 222 Group Meeting"}
        onSubmit={(newEventName) => {
          editEventName.mutate({
            host_email: "haiyuezhang63@gmail.com",
            name: newEventName,
            eventId: "568b0bed-63c6-4296-8e98-0c74e30f3391",
          });
        }}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        close={() => setIsDeleteDialogOpen(false)}
        eventName={"CS 222 Group Meeting"}

        onSubmit={() => {
          deleteEvent.mutate({
            host_email: email,
            eventId: "568b0bed-63c6-4296-8e98-0c74e30f3391",
          });
        }}
      />
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
