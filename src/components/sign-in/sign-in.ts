"use server";
import { signIn as authSignIn } from "@/auth";
export default async function signIn() {
  "use server";
  await authSignIn("google");
}
