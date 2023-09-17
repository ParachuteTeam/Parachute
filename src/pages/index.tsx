import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Navbar from "../components/section/Navbar";
import React from "react";
import { useElementMouseRelativeAngle } from "../utils/hooks";
import {
  Auth0LoginButton,
  GoogleLoginButton,
} from "../components/ui/LoginButton";
import Footer from "../components/section/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import { NextSeo } from "next-seo";
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
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
  const { angle, ref } = useElementMouseRelativeAngle();

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        <meta property="twitter: image" content="https://parachute.fyi/public/og-image-icon.png" />
        <meta property="twitter: title" content="Parachute" />
        <meta property="twitter: description" 
        content="A multi-user scheduling platform with enhanced features, providing an unparalleled experience compared to traditional web apps." />
      </Head>
      <NextSeo
        title="Parachute"
        description="A modern multi-user scheduling web application that is open-source, easy-to-use, and free forever. 
        Achieved effortless retrieval of all previous activity records, secured login with single sign-on services, 
        enhanced data privacy, and elevated user experience compared with original when2meet." 
        canonical = "https://parachute.fyi"
        themeColor="#ffa36d"
        openGraph={{
          url: "https://parachute.fyi",
          title: "Parachute",
          description:
            "A modern multi-user scheduling web application that is open-source, easy-to-use, and free forever.",
          images: [
            {
              url: "https://parachute.fyi/public/og-image-icon.png",
              width: 1200,
              height: 630,
              alt: "Parachute SEO Image",
            },
          ],
          site_name: "Parachute",
          type: "website",
          locale: "en_US",
        }}
      />
      <div className="flex h-screen w-screen flex-col">
        <Navbar />
        <div className="flex w-screen grow flex-col items-center justify-center gap-16 p-12 md:flex-row xl:gap-32">
          <div className="flex w-full flex-col items-center justify-center gap-4 md:w-[300px] md:items-start">
            <div className="text-5xl font-bold">🪂</div>
            <div className="text-5xl font-bold">when2meet</div>
            <div className="text-orange-elevated mt-[-4px] text-6xl font-bold">
              Elevated
            </div>
            <div className="mt-2 text-gray-500">
              Open-source, easy-to-use, free forever
            </div>
          </div>
          <div
            ref={ref}
            className="bg-colorful drop-shadow-pink h-[250px] w-full rounded-[8px] p-[2px] sm:max-w-[350px]"
            style={
              {
                "--colorful-bg-degree": `${angle - 90}deg`,
              } as React.CSSProperties
            }
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[6px] bg-white p-8">
              <div className="mb-2 text-sm text-gray-500">
                Try Parachute right now
              </div>
              <GoogleLoginButton />
              <Auth0LoginButton />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
