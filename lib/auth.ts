import {
  AuthOptions,
  getServerSession,
  Session,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prismaClient } from "./db";

export interface session extends Session{
  user:{
    id:string,
    name:string,
    email:string,
  }
}
//
// export interface user{
//   id:string,
//   name:string,
//   email:string,
//   image:string
// }
const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),

    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token} ){
      const newSession:session = session as session;
      try{ 
        const user = await prismaClient.user.findUnique({
          where: {
            email: token.email || "",
          },
        });
        if (user) {
          newSession.user.id = user.id;
        }
      } catch (e) {}
      return session;
    },
    async signIn(params) {
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
    async redirect(params){
      if(params.url !== '/')
        return "/dashboard"
      return params.url
    }
  },
  secret: "hasdklfji",
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
