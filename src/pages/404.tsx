import type { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "../components/section/Navbar";
import Footer from "../components/section/Footer";

const NotFoundPage: NextPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/").catch((error) => {
      console.error("Navigation error:", error);
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-100">
      <Navbar />
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 text-center">
        {/* 404 Text with Gradient */}
        <div
          className="absolute text-center font-bold"
          style={{
            fontFamily: "Inter",
            fontSize: "720px",
            fontWeight: 900,
            lineHeight: "100px",
            letterSpacing: "-0.08em",
            textAlign: "center",
            background:
              "linear-gradient(89.72deg, rgba(238, 147, 81, 0.405) 28.58%, rgba(255, 216, 80, 0.45) 98.48%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            position: "absolute",
            left: "-100px", // Adjust X position
            top: "-10px", // Adjust Y position
            width: "1619px", // Set width
            height: "762px", // Set height
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1, // Ensure the 404 text is behind other elements
          }}
        >
          4 0 4
        </div>

        {/* Ooops Text */}
        <div
          className="absolute"
          style={{
            zIndex: 2,
            fontFamily: "Inter",
            fontSize: "185px",
            color: "#000000",
            textAlign: "center",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            position: "absolute",
            left: "-45px",
            top: "70px",
            width: "1619px",
            height: "762px",
          }}
        >
          Ooops!
        </div>

        {/* Subtext positioned on top */}
        <p
          className="absolute mt-2 text-lg"
          style={{
            left: "450px",
            top: "48%",
            zIndex: 2,
            fontFamily: "Inter",
            fontSize: "40px",
          }}
        >
          We can’t find the page you requested
        </p>

        {/* Go Home Button positioned on top */}
        <button
          onClick={handleGoHome}
          className="absolute mt-6 rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800"
          style={{
            left: "640px",
            top: "65%",
            zIndex: 2,
            width: "200px",
            height: "50px",
          }}
        >
          Go Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
