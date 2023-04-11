import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const image = session?.user.image as string;
  const name = session?.user.name;
  const email = session?.user.email;

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const onClickSignOut = async () => {
    await signOut({
      redirect: false,
    });
    await router.push("/");
  };

  return (
    <div className="sticky top-0 flex w-full justify-center bg-white py-4 px-12">
      <div className="mx-auto flex max-w-[1200px] grow cursor-pointer text-3xl font-bold">
        <div className="grow cursor-pointer text-3xl font-bold">
          <div
            className="max-w-[140px] grow cursor-pointer text-3xl font-bold"
            onClick={() => void router.push("/")}
          >
            Parachute
          </div>
        </div>
        {session && (
          <div className="relative">
            <img
              onClick={toggleDropdown}
              className="h-10 w-10 cursor-pointer rounded-full"
              src={image}
              alt="User dropdown"
            />
            {dropdownVisible && (
              <div
                id="userDropdown"
                className="w-50 absolute right-0 top-[48px] z-10 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
              >
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div> {name} </div>
                  <div className="truncate font-medium"> {email} </div>
                </div>
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="avatarButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Earnings
                    </a>
                  </li>
                </ul>
                <div onClick={() => void onClickSignOut()} className="py-1">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
