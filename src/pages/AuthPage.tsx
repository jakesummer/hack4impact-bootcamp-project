import LabeledInput from "../components/LabeledInput.tsx";

interface AuthPageProps {
  mode: "signin" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignin = mode === "signin";

  return (
    <>
      <form>
        {!isSignin && (
          <LabeledInput labelText="Name" inputName="name" required={true} />
        )}
        <LabeledInput
          labelText="Email"
          inputType="email"
          inputName="email"
          required={true}
        />
        <LabeledInput
          labelText="Password"
          inputType="password"
          inputName="password"
          required={true}
        />
      </form>
    </>
  );
}
