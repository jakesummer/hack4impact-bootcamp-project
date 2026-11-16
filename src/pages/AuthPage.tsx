import { Link, useNavigate } from "react-router";
import LabeledInput from "../components/LabeledInput.tsx";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase/firebase.ts";
import type { UserData } from "../types.ts";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

function getErrorMessage(error: string) {
  switch (error) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-password":
      return "Please enter a valid password.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/email-already-exists":
      return "This email is already in use.";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    default:
      return "Something went wrong. Please try again.";
  }
}

interface AuthPageProps {
  mode: "signin" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const isSignin = mode === "signin";

  const handleAuth = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form && !form.reportValidity()) return;

    try {
      if (isSignin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const defaultData: UserData = { name, accountType: "participant" }; // TODO: change account type based on login
        await setDoc(doc(db, "users", userCred.user.uid), defaultData);
      }
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(e.code));
        console.log(e.code);
      }
    }
  };

  return (
    <>
      <div>
        <Link to={"/signin"}>Sign In</Link>
        <Link to={"/signup"}>Create</Link>
      </div>

      <form>
        {!isSignin && (
          <LabeledInput
            labelText="Name"
            inputName="name"
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <LabeledInput
          labelText="Email"
          inputType="email"
          inputName="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LabeledInput
          labelText="Password"
          inputType="password"
          inputName="password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p>{errorMessage}</p>}

        <button onClick={(e) => handleAuth(e)}>
          {isSignin ? "Sign In" : "Create Account"}
        </button>
      </form>
    </>
  );
}
