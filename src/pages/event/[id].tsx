import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../../components/section/Navbar";
import React from "react";
import { useSession } from "next-auth/react";
import { LogInCard } from "../../components/section/LogInCard";
import { EventInfoHeader } from "../../components/section/EventInfoHeader";
import { OperationCard } from "../../components/section/OperationCard";
import { ScreenLoading } from "../../components/ui/ScreenLoading";
import { PrismaClient } from "@prisma/client";

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
  const router = useRouter();
  const { id } = router.query;
  void id;

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <ScreenLoading />;
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
