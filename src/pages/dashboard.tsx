import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../components/section/Navbar";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { EventList } from "../components/section/EventList";
import { NewEventCard } from "../components/section/NewEventCard";
import { useIsMobile } from "../utils/hooks";
import { ScreenLoading } from "../components/ui/ScreenLoading";
import Footer from "../components/section/Footer";

const Dashboard: NextPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showWizard, setShowWizard] = useState(false);
  const isMobile = useIsMobile();

  const router = useRouter();

  if (!isLoaded) {
    return <ScreenLoading />;
  }

  if (!isSignedIn) {
    void router.push("/");
    return <ScreenLoading />;
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-gray-100">
      <Navbar />
      <div className="flex grow justify-center px-4 py-8 md:px-12">
        <div className="flex h-full w-full max-w-[1200px] flex-row gap-8">
          <div className="flex h-full flex-grow flex-col">
            <div className="mb-4 flex flex-row items-center justify-between">
              <div className="text-2xl font-bold">Recent Events</div>
              <div
                className="primary-button cursor-pointer text-sm md:hidden"
                onClick={() => setShowWizard(!showWizard)}
              >
                New / Join
              </div>
            </div>
            {/* <EventList /> */}
          </div>
          {!isMobile ? (
            <div className="flex h-full flex-col">
              <div className="mb-4 text-2xl font-bold">Add Event</div>
              <NewEventCard />
            </div>
          ) : (
            showWizard && (
              <div
                className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-row items-start justify-center bg-black bg-opacity-50 p-4 pt-20"
                onClick={() => setShowWizard(false)}
              >
                <NewEventCard />
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
