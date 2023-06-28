import React from "react";
import { BsGithub } from "react-icons/bs";
import appData from "../../app-data";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <div
      className={`flex w-full items-center justify-center border-t border-gray-200 px-4 py-4 md:px-12 ${
        className ?? ""
      }`}
    >
      <div className="flex max-w-[1200px] shrink grow items-center">
        <div className="text-sm text-gray-500">
          © 2023 Parachute Team. All rights reserved.
        </div>
        <div className="grow" />
        <a
          href={appData.GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BsGithub className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
