import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "@/app/lib/dbConnect";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({ email: profile?.email });

        if (!existingUser) {
          const newUser = new User({
            name: profile?.name,
            email: profile?.email,
            friends: [],
          });
          await newUser.save();
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      try {
        await dbConnect();
        if (account && profile) {
          const user_db = await User.findOne({ email: profile?.email }); // user id is not stored by google, but we need to make api request
          token.id = user_db._id;
          token.name = user_db.name;
          token.email = user_db.email;
        }
      } catch (error) {
        console.log(error);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
