import type { NextPage } from "next";
import React from "react";
import Footer from "../components/section/Footer";
import Navbar from "../components/section/Navbar";
import { UserProfile, useUser } from "@clerk/nextjs";
import { ScreenLoading } from "../components/ui/ScreenLoading";
import { useRouter } from "next/router";

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <ScreenLoading />;
  }

  if (!isSignedIn) {
    void router.push("/");
    return <ScreenLoading />;
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar />
      <div className="flex grow flex-row items-center justify-center py-12">
        <UserProfile />
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
