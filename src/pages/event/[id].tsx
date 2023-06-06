import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../../components/section/Navbar";
import React from "react";
import { useSession } from "next-auth/react";
import { LogInCard } from "../../components/section/LogInCard";
import { EventInfoHeader } from "../../components/section/EventInfoHeader";
import { OperationCard } from "../../components/section/OperationCard";

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
