import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Navbar from "../components/section/Navbar";
import React from "react";
import Footer from "../components/section/Footer";
import { clerkClient, SignIn } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Home: NextPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar />
      <div className="flex w-screen grow flex-col items-center justify-center gap-16 p-12 lg:flex-row xl:gap-32">
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-[300px] lg:items-start">
          <div className="text-5xl font-bold">🪂</div>
          <div className="text-5xl font-bold">when2meet</div>
          <div className="text-orange-elevated mt-[-4px] text-6xl font-bold">
            Elevated
          </div>
          <div className="mt-2 text-gray-500">
            Open-source, easy-to-use, free forever
          </div>
        </div>
        <SignIn signUpUrl={"/sign-up"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
