import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const ScreenLoading: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <AiOutlineLoading3Quarters className="h-12 w-12 animate-spin" />
    </div>
  );
};
