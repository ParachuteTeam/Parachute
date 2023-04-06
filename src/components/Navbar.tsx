import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="sticky top-0 flex w-full justify-center bg-white py-4 px-12">
      <div className="max-w-[1200px] grow cursor-pointer text-3xl font-bold">
        Parachute
      </div>
    </div>
  );
};

export default Navbar;
