import React, { Fragment, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { GroupAvailabilityZone, MyAvailabilityZone } from "./AvailabilityZone";
import { RoundedTimezoneInput } from "../ui/TimezoneInput";
import { getCurrentTimeZoneTag } from "../../utils/utils";
import { useUserParticipateOf } from "../../utils/api-hooks";

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

export const OperationCard: React.FC = () => {
  const router = useRouter();
  const eventId = router.query.id as string;

  const [timeZoneTag, setTimeZoneTag] = React.useState(getCurrentTimeZoneTag());

  const { data: participate } = useUserParticipateOf(eventId);
  useEffect(() => {
    if (participate?.timeZone) {
      setTimeZoneTag(participate.timeZone);
    }
  }, [participate?.timeZone]);

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
              value={timeZoneTag}
              onChange={setTimeZoneTag}
            />
          </div>
        </Tab.Group>
      </div>
    </div>
  );
};
