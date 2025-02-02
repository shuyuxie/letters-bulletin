import signIn from "./sign-in";

export default function SignIn() {
  return (
    <form action={signIn}>
      <button type="submit" className="brown-button">
        Signin with Google
      </button>
    </form>
  );
}
