import React from "react";
import { MdOutlineAccessTime, MdOutlineCalendarToday } from "react-icons/md";
import { HiOutlineGlobe } from "react-icons/hi";
import { Auth0LoginButton, GoogleLoginButton } from "../ui/LoginButton";

export const LogInCard: React.FC = () => {
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
