"use server";
import { signOut as authSignOut } from "@/auth";
export default async function signOut() {
  "use server";
  await authSignOut();
}
