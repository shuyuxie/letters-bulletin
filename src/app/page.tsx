import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import Dashboard from "@/components/dashboard";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth();

  return session ? (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  ) : (
    <div className="flex h-screen w-screen flex-col justify-center items-center">
      <h1 className="title">Welcome to Bulletin</h1>
      <SignIn />
    </div>
  );
}
