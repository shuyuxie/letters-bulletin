import signOut from "./sign-out";

export default function SignOut() {
  return (
    <form action={signOut}>
      <button type="submit">log out</button>
    </form>
  );
}
