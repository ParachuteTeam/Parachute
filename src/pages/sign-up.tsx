import type { NextPage } from "next";
import Navbar from "../components/section/Navbar";
import Footer from "../components/section/Footer";
import { SignUp } from "@clerk/nextjs";

const SignUpPage: NextPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar />
      <div className="flex grow flex-row items-center justify-center">
        <SignUp signInUrl="/" />
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
