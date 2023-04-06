import React from "react";
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  return (
    <div className="sticky top-0 flex w-full justify-center bg-white py-4 px-12">
      <div className="max-w-[1200px] grow cursor-pointer text-3xl font-bold">
        <div 
          onClick={() => void router.push('/')}
          className="max-w-[140px] grow cursor-pointer text-3xl font-bold"
        >
          Parachute
        </div> 
      </div>
    </div>
  );
};

export default Navbar;
