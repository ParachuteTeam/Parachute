import React, { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { GroupAvailabilityZone, MyAvailabilityZone } from "./AvailabilityZone";
import { RoundedTimezoneInput } from "../ui/TimezoneInput";
import { getCurrentTimeZoneTag } from "../../utils/date-utils";
import {
  useUpdateUserTimeZoneIn,
  useUserParticipateOf,
} from "../../utils/api-hooks";
import { ButtonWithState } from "../ui/Button";

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

const TimeZoneSelectionZone: React.FC<{
  eventId: string;
  timeZoneTag: string;
  setTimeZoneTag: (tag: string) => void;
}> = ({ eventId, timeZoneTag, setTimeZoneTag }) => {
  // We need an extra state to store the user's existing timezone, so that auto-refetch doesn't cause the timezone input to reset
  // We don't simply turn off auto-refetch because we want to update the timezone input when the user changes their timezone elsewhere
  const [existingUserTimeZone, setExistingUserTimeZone] = useState("");

  const {
    data: participate,
    refetch: refetchParticipate,
    isLoading: participateLoading,
  } = useUserParticipateOf(eventId);
  useEffect(() => {
    if (participate) {
      if (participate.timeZone !== existingUserTimeZone) {
        setExistingUserTimeZone(participate.timeZone);
        setTimeZoneTag(participate.timeZone);
      }
    } else {
      setExistingUserTimeZone("");
      setTimeZoneTag(getCurrentTimeZoneTag());
    }
  }, [existingUserTimeZone, setTimeZoneTag, participate]);

  const [loading, setLoading] = useState(false);
  const updateUserTimeZone = useUpdateUserTimeZoneIn(eventId);
  const handleSaveTimeZone = async () => {
    setLoading(true);
    await updateUserTimeZone(timeZoneTag);
    await refetchParticipate();
    setLoading(false);
  };

  return (
    <div className="flex w-full flex-row items-center gap-2 rounded-b-md border-t border-gray-300 bg-white px-6 py-4 text-sm">
      <div className="flex grow flex-col gap-1">
        <p className="font-semibold">My timezone</p>
        <p className="font-light">
          All time and availability information are displayed for this timezone
        </p>
      </div>
      {!participateLoading && (
        <>
          <RoundedTimezoneInput
            className="w-[300px] px-0"
            direction="up"
            value={timeZoneTag}
            onChange={setTimeZoneTag}
          />
          {participate &&
            existingUserTimeZone !== "" &&
            timeZoneTag !== participate.timeZone && (
              <>
                <ButtonWithState
                  className="primary-button-with-hover py-3 text-sm"
                  loadingClassName="primary-button-loading py-3 text-sm"
                  onClick={handleSaveTimeZone}
                >
                  Save
                </ButtonWithState>
                <ButtonWithState
                  className="rounded-button py-3 text-sm"
                  disabledClassName="rounded-button-disabled py-3 text-sm"
                  disabled={loading}
                  onClick={() => setTimeZoneTag(existingUserTimeZone)}
                >
                  Reset
                </ButtonWithState>
              </>
            )}
        </>
      )}
    </div>
  );
};

export const OperationCard: React.FC = () => {
  const router = useRouter();
  const eventId = router.query.id as string;
  const [timeZoneTag, setTimeZoneTag] = useState("");
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
              <MyAvailabilityZone eventID={eventId} timeZoneTag={timeZoneTag} />
            </Tab.Panel>
            <Tab.Panel>
              <GroupAvailabilityZone
                eventID={eventId}
                timeZoneTag={timeZoneTag}
              />
            </Tab.Panel>
          </Tab.Panels>
          <TimeZoneSelectionZone
            eventId={eventId}
            timeZoneTag={timeZoneTag}
            setTimeZoneTag={setTimeZoneTag}
          />
        </Tab.Group>
      </div>
    </div>
  );
};
