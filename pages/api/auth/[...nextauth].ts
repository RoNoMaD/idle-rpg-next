import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";

import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const clientId = process.env.GITHUB_ID;
if (clientId === undefined) {
  throw new Error("GITHUB_ID env variable is mandatory to run this app");
}
const clientSecret = process.env.GITHUB_SECRET;
if (clientSecret === undefined) {
  throw new Error("GITHUB_SECRET env variable is mandatory to run this app");
}

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId,
      clientSecret,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
  callbacks: {
    signIn: async (user, account) => {
      const res = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${account.accessToken}`,
        },
      });
      const emails = await res.json();
      if (!emails || emails.length === 0) {
        return;
      }
      const sortedEmails = emails.sort((a, b) => b.primary - a.primary);
      user.email = sortedEmails[0].email;
      return true;
    },
  },
  // debug: true,
};
