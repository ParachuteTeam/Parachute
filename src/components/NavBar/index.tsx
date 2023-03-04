import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
};

export default NavBar;

