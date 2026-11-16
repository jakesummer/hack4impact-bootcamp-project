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

interface AuthPageProps {
  mode: "signin" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const isSignin = mode === "signin";

  const handleAuth = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
      alert(e);
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

        <button onClick={(e) => handleAuth(e)}>
          {isSignin ? "Sign In" : "Create Account"}
        </button>
      </form>
    </>
  );
}
