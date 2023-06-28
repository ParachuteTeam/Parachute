import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../../components/section/Navbar";
import React from "react";
import { useSession } from "next-auth/react";
import { LogInCard } from "../../components/section/LogInCard";
import { EventInfoHeader } from "../../components/section/EventInfoHeader";
import { OperationCard } from "../../components/section/OperationCard";
import Footer from "../../components/section/Footer";

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
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-gray-100">
      <Navbar />
      <EventInfoHeader />
      <OperationCard />
      <Footer />
    </div>
  );
};

export default EventPage;
