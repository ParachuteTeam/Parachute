import React from "react";
import { MdOutlineAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import { HiOutlineGlobe } from "react-icons/hi";
import { Auth0LoginButton, ContinueButton, GoogleLoginButton } from "../ui/LoginButton";
import { useRouter } from "next/router";
import { useEvent } from "../../utils/api-hooks";
import {
  formatOccurring,
  formatTimespan,
  formatTimeZoneTag,
} from "../../utils/date-utils";

export const LogInCard: React.FC = () => {
  const router = useRouter();
  const eventId = router.query.id as string;

  const { data: event } = useEvent(eventId);

  const occurringDaysArray = event?.occuringDays
    .split(",")
    .map((s: string) => new Date(s));

  return (
    <div className="flex h-full w-full grow flex-row items-center justify-center p-4">
      <div className="flex h-[600px] max-w-[750px] flex-1 items-center justify-center rounded-lg border-[1px] border-gray-300">
        <div className="my-10 flex h-full w-full flex-col">
          {event ? (
            <div className="flex w-full flex-col gap-2 border-b-[1px] border-gray-300 p-5">
              <div className="flex flex-row items-center gap-1 text-sm text-gray-500">
                <MdOutlineCalendarToday />
                <div>
                  {event
                    ? formatOccurring(
                      occurringDaysArray ?? [],
                      event.type === "DAYSOFWEEK",
                      event.timeZone
                    )
                    : "Loading..."}
                </div>
                <MdOutlineAccessTime className="ml-1" />
                <div>
                  {event
                    ? formatTimespan(event.begins, event.ends, event.timeZone)
                    : "Loading..."}
                </div>
                <HiOutlineGlobe className="ml-1" />
                <div>
                  {event ? formatTimeZoneTag(event.timeZone) : "Loading..."}
                </div>
              </div>
              <div className="text-3xl font-semibold text-black">
                {event?.name ?? "Loading..."}
              </div>
              <div className="text-sm font-normal text-black">
                {event &&
                  (event._count.participant === 1 ? (
                    <div>No one except host has filled yet</div>
                  ) : (
                    <div>
                      {event._count.participant} people filled including host
                    </div>
                  ))}
                {!event && "Loading..."}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-2 border-b-[1px] border-gray-300 p-5">
              <div className="skeleton h-5 max-w-[400px]" />
              <div className="skeleton h-9 max-w-[600px]" />
              <div className="skeleton h-5 max-w-[300px]" />
            </div>
          )}
          <div className="flex h-full w-full flex-row items-center justify-center pb-7">
            <div className="flex w-full max-w-[350px] flex-col items-center justify-center gap-3 p-8">
              {!event?.is_anon && <div className="mb-2 text-sm text-gray-500">
                Sign in to join event
              </div>}
              {!event?.is_anon && <>
                <GoogleLoginButton />
                <Auth0LoginButton />
              </>}
              {event?.is_anon && <ContinueButton />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
