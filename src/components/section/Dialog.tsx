import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ButtonWithState } from "../ui/Button";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { useSession } from "next-auth/react";

interface EditDialogProps {
  isOpen: boolean;
  close: () => void;
  eventName: string;
  participants: {
    user: {
      name: string;
    };
    userID: string;
    timeZone: string;
  }[];
  onSubmit: (eventName: string, deletedUserIDs: string[]) => Promise<void>;
}
export const EditDialog: React.FC<EditDialogProps> = ({
  isOpen,
  close,
  eventName,
  participants,
  onSubmit,
}) => {
  const [newEventName, setNewEventName] = useState("");
  const [deletedUserIDs, setDeletedUserIDs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

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
                Edit Event Details
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
              <div className="input-field mt-4 text-left">
                <label>Participants</label>
                <div className="text-left text-xs text-gray-500">
                  {participants.map((participant) => (
                    <div
                      key={participant.userID}
                      className="flex flex-row pt-1"
                    >
                      <div
                        className={
                          deletedUserIDs.includes(participant.userID)
                            ? "line-through"
                            : ""
                        }
                      >
                        {participant.user.name} ({participant.timeZone})
                        <div className="text-xs text-gray-400">
                          {participant.userID}
                        </div>
                      </div>
                      {participant.userID !== session?.user.id && (
                        <button
                          className="ml-auto text-xl"
                          onClick={() => {
                            if (deletedUserIDs.includes(participant.userID)) {
                              setDeletedUserIDs(
                                deletedUserIDs.filter(
                                  (id) => id !== participant.userID
                                )
                              );
                            } else {
                              setDeletedUserIDs([
                                ...deletedUserIDs,
                                participant.userID,
                              ]);
                            }
                          }}
                        >
                          {deletedUserIDs.includes(participant.userID) ? (
                            <AiOutlineUserAdd className="text-gray-400" />
                          ) : (
                            <AiOutlineUserDelete className="text-red-400" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-4">
                <ButtonWithState
                  className="rounded-button w-[50%] text-sm"
                  disabledClassName="rounded-button-disabled w-[50%] text-sm"
                  disabled={isSubmitting}
                  onClick={() => close()}
                >
                  Cancel
                </ButtonWithState>
                <ButtonWithState
                  className="primary-button-with-hover w-[50%] text-sm font-normal"
                  loadingClassName="primary-button-loading w-[50%] text-sm font-normal"
                  disabledClassName="primary-button-loading w-[50%] text-sm font-normal"
                  loading={isSubmitting}
                  disabled={newEventName.length === 0}
                  onClick={() => {
                    setIsSubmitting(true);
                    onSubmit(newEventName, deletedUserIDs).finally(() => {
                      setIsSubmitting(false);
                      close();
                    });
                  }}
                >
                  Save
                </ButtonWithState>
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
  onSubmit: () => Promise<void>;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  close,
  eventName,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
                <ButtonWithState
                  className="rounded-button w-[50%] text-sm"
                  disabledClassName="rounded-button-disabled w-[50%] text-sm"
                  disabled={isSubmitting}
                  onClick={() => close()}
                >
                  Cancel
                </ButtonWithState>
                <ButtonWithState
                  className="danger-button w-[50%] text-sm"
                  loadingClassName="danger-button-loading w-[50%] text-sm"
                  loading={isSubmitting}
                  onClick={() => {
                    setIsSubmitting(true);
                    onSubmit().finally(() => {
                      setIsSubmitting(false);
                      close();
                    });
                  }}
                >
                  Permanently Delete
                </ButtonWithState>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
