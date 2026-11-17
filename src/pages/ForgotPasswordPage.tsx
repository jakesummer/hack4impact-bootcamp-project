import { useState } from "react";
import LabeledInput from "../components/LabeledInput.tsx";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase.ts";
import { Link } from "react-router";

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
    <div>
      <h1>Reset Password</h1>
      <form>
        <LabeledInput
          labelText="Email"
          inputType="email"
          inputName="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {sent && (
          <p>
            If an account exists for that email, a password reset link has been
            sent
          </p>
        )}

        <button onClick={handleClick}>Send Reset Email</button>
      </form>

      <Link to="/signin">Back to Sign In</Link>
    </div>
  );
}
