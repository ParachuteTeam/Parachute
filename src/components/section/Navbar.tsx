import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import OnHover from "../ui/OnHover";
import Link from "next/link";
import appData from "../../app-data";
import { HiOutlineExternalLink } from "react-icons/hi";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const image = session?.user.image as string;
  const name = session?.user.name;
  const email = session?.user.email;

  const onClickSignOut = async () => {
    await signOut({
      redirect: false,
    });
    await router.push("/");
  };

  return (
    <div className="sticky top-0 flex w-full justify-center bg-white px-4 py-3 md:px-12 md:py-4">
      <div className="mx-auto flex max-w-[1200px] grow items-center gap-4 font-bold md:gap-8">
        <div className="grow">
          <Link
            className="max-w-[140px] grow cursor-pointer text-2xl font-bold md:text-3xl"
            href={session ? "/dashboard" : "/"}
          >
            Parachute
          </Link>
        </div>
        <a
          className="flex flex-row items-center gap-0.5 font-normal text-gray-500"
          href={appData.GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
          <HiOutlineExternalLink />
        </a>
        {session && (
          <OnHover
            content={
              <div className="w-50 absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:divide-gray-600 dark:bg-gray-700">
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
                <div onClick={() => void onClickSignOut()} className="py-1">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                    Sign out
                  </a>
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

interface NavLinkProps {
  href: string;
  linkName: string;
}
const NavLink: React.FC<NavLinkProps> = ({ href, linkName }) => {
  return (
    <li>
      <a
        href={href}
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        {linkName}
      </a>
    </li>
  );
};
