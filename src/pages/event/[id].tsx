import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Navbar from "../../components/section/Navbar";
import React from "react";
import { useSession } from "next-auth/react";
import { LogInCard } from "../../components/section/LogInCard";
import { EventInfoHeader } from "../../components/section/EventInfoHeader";
import { OperationCard } from "../../components/section/OperationCard";
import Footer from "../../components/section/Footer";
import { ScreenLoading } from "../../components/ui/ScreenLoading";
import { PrismaClient } from "@prisma/client";
import {NextSeo} from "next-seo";

interface EventPageProps {
  name: string;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const prisma = new PrismaClient();

export const getStaticProps: GetStaticProps<EventPageProps> = async (ctx) => {
  const event = await prisma.event.findUnique({
    where: {
      id: (ctx.params?.id as string) ?? "",
    },
  });

  if (event === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      name: event.name,
    },
    revalidate: 10,
  };
};

const EventPage: NextPage<EventPageProps> = ({
  name,
}) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <ScreenLoading />;
  }

  if (!session) {
    return (
      <>
        <NextSeo
          title={`${name} | Parachute`}
        />
        <div className="flex min-h-screen w-screen flex-col">
          <Navbar />
          <LogInCard />
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <NextSeo
        title={`${name} | Parachute`}
      />
      <div className="flex min-h-screen w-screen flex-col bg-gray-100">
        <Navbar />
        <EventInfoHeader />
        <OperationCard />
        <Footer />
      </div>
    </>
  );
};

export default EventPage;
