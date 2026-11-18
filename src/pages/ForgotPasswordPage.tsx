import { useState } from "react";
import LabeledInput from "../components/LabeledInput.tsx";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase.ts";
import { Link } from "react-router";
import AuthContainer from "../components/AuthContainer.tsx";
import PrimaryButton from "../components/PrimaryButton.tsx";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && !form.reportValidity()) return;

    try {
      sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContainer>
      <h1 className="text-3xl">Reset Password</h1>
      <form id="forgot-password-form">
        <LabeledInput
          labelText="Email"
          inputType="email"
          inputName="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className={!sent ? "invisible" : ""}>
          If an account exists for that email, a password reset link has been
          sent
        </p>
      </form>
      <PrimaryButton
        text="Send Reset Email"
        form="forgot-password-form"
        onClick={handleClick}
      />
      <Link
        to="/signin"
        className="text-lg text-green-light hover:text-green-dark"
      >
        Back to Sign In
      </Link>
    </AuthContainer>
  );
}
