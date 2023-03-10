import { type NextPage } from "next";
import LandingPage from "../components/LandingPage";

const Home: NextPage = () => {
  // use component here because this route is used by both landing page and dashboard,
  // and we want to custom navbar on the landing page
  return (
    <>
      <LandingPage />
    </>
  );
};

export default Home;