import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Navbar from "../../components/section/Navbar";
import React from "react";
import { LogInCard } from "../../components/section/LogInCard";
import { EventInfoHeader } from "../../components/section/EventInfoHeader";
import { OperationCard } from "../../components/section/OperationCard";
import Footer from "../../components/section/Footer";
import { ScreenLoading } from "../../components/ui/ScreenLoading";
import { PrismaClient } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const prisma = new PrismaClient();

export const getStaticProps: GetStaticProps = async (ctx) => {
  const count = await prisma.event.count({
    where: {
      id: (ctx.params?.id as string) ?? "",
    },
  });

  if (count === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
    revalidate: 10,
  };
};

const EventPage: NextPage = () => {
  const { isLoaded, sessionId } = useAuth();

  if (!isLoaded) {
    return <ScreenLoading />;
  }

  if (!sessionId) {
    return (
      <div className="flex min-h-screen w-screen flex-col">
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
