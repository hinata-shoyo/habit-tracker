import { AuthOptions, getServerSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma as prismaClient } from "./db";

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: { params: { scope: "read:user user:email" } },
    }),

    // ...add more providers here
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user) {
        try {
          const user = await prismaClient.user.findUnique({
            where: {
              email: token.email || "",
            },
          });
          if (user) {
            session.user.id = user.id;
          }
        } catch (e) {}
      }
      return session;
    },
    signIn: async (params) => {
      if (!params.user.email) {
        return false;
      }
      try {
        await prismaClient.user.create({
          data: {
            email: params.user.email,
            name: params.user.name,
          },
        });
      } catch (e) {}
      return true;
    },
    redirect: async (params) => {
      if (params.url !== "/") return "/dashboard";
      return params.url;
    },
  },
  secret: "hasdklfji",
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
