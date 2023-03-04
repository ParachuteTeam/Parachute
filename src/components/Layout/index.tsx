import type { ReactNode } from "react";
import NavBar from "../NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;