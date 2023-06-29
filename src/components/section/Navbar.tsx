import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import OnHover from "../ui/OnHover";
import Link from "next/link";
import React, { useState } from "react";

interface NavLinkProps {
  href: string;
  linkName: string;
}
const NavLink: React.FC<NavLinkProps> = ({ href, linkName }) => {
  return (
    <li>
      <Link
        href={href}
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        {linkName}
      </Link>
    </li>
  );
};

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  buttonText: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  disabled,
  buttonText,
}) => {
  return (
    <li>
      <button
        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        disabled={disabled}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </li>
  );
};

const Navbar = () => {
  const { data: session } = useSession();
  const image = session?.user.image as string;
  const name = session?.user.name;
  const email = session?.user.email;

  const [signingOut, setSigningOut] = useState(false);

  const onClickSignOut = () => {
    setSigningOut(true);
    void signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="sticky top-0 flex w-full justify-center border-b border-gray-200 bg-white px-4 py-3 md:px-12 md:py-4">
      <div className="mx-auto flex max-w-[1200px] grow items-center font-bold">
        <div className="grow">
          <Link
            className="max-w-[140px] grow cursor-pointer text-2xl font-bold md:text-3xl"
            href={session ? "/dashboard" : "/"}
          >
            Parachute
          </Link>
        </div>
        {session && (
          <OnHover
            content={
              <div className="w-50 absolute right-0 origin-top-right pt-1">
                <div className="divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:divide-gray-600 dark:bg-gray-700">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>{name}</div>
                    <div className="truncate font-medium">{email}</div>
                  </div>
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="avatarButton"
                  >
                    <NavLink href="/dashboard" linkName="Dashboard" />
                  </ul>
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="avatarButton"
                  >
                    <NavButton
                      onClick={onClickSignOut}
                      disabled={signingOut}
                      buttonText={signingOut ? "Signing out..." : "Sign out"}
                    />
                  </ul>
                </div>
              </div>
            }
          >
            <Image
              className="cursor-pointer rounded-full"
              src={image}
              alt="User dropdown"
              width={40}
              height={40}
            />
          </OnHover>
        )}
      </div>
    </div>
  );
};

export default Navbar;
