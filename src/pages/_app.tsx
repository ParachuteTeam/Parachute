import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Auth0Provider } from "@auth0/auth0-react";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth0Provider
        domain="dev-nvzp38s2okb5rvuh.us.auth0.com"
        clientId="HSydcrGc8WCUKW8QUUTWtvCQ3RkOJcCf"
        authorizationParams={{
          redirect_uri: "http://localhost:3000",
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Auth0Provider>
      ,
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
