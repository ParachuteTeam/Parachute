import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface EditDialogProps {
  isOpen: boolean;
  close: () => void;
  eventName: string;
  onSubmit: (eventName: string) => void;
}

interface EditDialogProps {
  isOpen: boolean;
  close: () => void;
  eventName: string;
  onSubmit: (eventName: string) => void;
}
export const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  close,
  eventName,
  onSubmit,
}) => {
  const [newEventName, setNewEventName] = useState("");
  useEffect(() => {
    setNewEventName(eventName);
  }, [eventName]);
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
                  placeholder="Enter your new event name here..."
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

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
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
