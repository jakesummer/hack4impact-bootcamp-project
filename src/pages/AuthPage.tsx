interface AuthPageProps {
  mode: "signin" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignin = mode === "signin";

  return isSignin ? <p>sign in</p> : <p>sign up</p>
}
