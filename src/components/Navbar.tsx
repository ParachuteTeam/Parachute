import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="fixed top-0 w-full py-4 px-12 flex justify-center">
      <div className="grow max-w-[1200px] text-3xl font-bold cursor-pointer">
        Parachute
      </div>
    </div>
  )
}

export default Navbar;
