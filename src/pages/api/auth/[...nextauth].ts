// import NextAuth from "next-auth";
// import Auth0Provider from "next-auth/providers/auth0";
// import GoogleProvider from 'next-auth/providers/google'
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export const authOptions = {
//   // Configure one or more authentication providers
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//         clientId: process.env.GOOGLE_ID as string,
//         clientSecret: process.env.GOOGLE_SECRET as string
//     }),
//     Auth0Provider({
//       clientId: process.env.AUTH0_CLIENT_ID as string,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
//       issuer: process.env.AUTH0_ISSUER
//     }),
//     // ...add more providers here
//   ],
// }
// export default NextAuth(authOptions)
import NextAuth from "next-auth";
import { authOptions } from "../../../server/auth";

export default NextAuth(authOptions);
