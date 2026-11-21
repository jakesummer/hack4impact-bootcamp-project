import { Link, useNavigate } from "react-router";
import LabeledInput from "../components/LabeledInput.tsx";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase/firebase.ts";
import type { AccountType, UserData } from "../types.ts";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import AuthContainer from "../components/AuthContainer.tsx";
import PrimaryButton from "../components/PrimaryButton.tsx";

type SelectableAccountTypes = Exclude<AccountType, "admin">; // admin can't be selected when creating account

interface AuthPageProps {
  mode: "signin" | "signup";
}

interface SwitchModeButtonProps {
  to: string;
  text: string;
  side: "left" | "right";
  selected: boolean;
}

interface AccountTypeSelectionProps {
  value: SelectableAccountTypes;
  setAccountType: React.Dispatch<React.SetStateAction<SelectableAccountTypes>>;
}

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
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    default:
      return "Something went wrong. Please try again.";
  }
}

function SwitchModeButton({ to, text, side, selected }: SwitchModeButtonProps) {
  const rounded = side === "left" ? "rounded-l-lg" : "rounded-r-lg";
  const bgColor = selected ? "bg-green-light/50" : "bg-white";
  const hoverColor = !selected ? "hover:bg-grayscale-6" : "";
  const cursor = selected ? "cursor-default" : "cursor-pointer";
  return (
    <Link
      to={to}
      className={`w-[50%] flex justify-center text-xl py-3 border border-black ${rounded} ${bgColor} ${hoverColor} ${cursor}`}
    >
      {text}
    </Link>
  );
}

const ACCOUNT_TYPE_OPTIONS: { value: SelectableAccountTypes; label: string }[] =
  [
    { value: "participant", label: "Participant" },
    { value: "volunteer", label: "Volunteer" },
  ];

function AccountTypeSelection({
  value,
  setAccountType,
}: AccountTypeSelectionProps) {
  return (
    <fieldset className="w-full flex flex-col">
      <legend className="mb-1.5">Account Type</legend>
      <div className="w-full flex gap-2">
        {ACCOUNT_TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="w-full h-full flex justify-center"
          >
            <input
              type="radio"
              name="accountType"
              value={option.value}
              checked={value === option.value}
              onChange={() => setAccountType(option.value)}
              className="peer sr-only"
            />
            <span
              className="w-full h-full peer-not-checked:cursor-pointer flex justify-center bg-white 
              peer-checked:bg-green-medium py-3 rounded-lg text-black peer-checked:text-white text-lg border 
              border-black peer-checked:border-green-medium"
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [accountType, setAccountType] =
    useState<SelectableAccountTypes>("participant");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const isSignin = mode === "signin";

  const handleAuth = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setErrorMessage("");
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
        const defaultData: UserData = { name, accountType: accountType };
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
    <AuthContainer>
      <div className="w-25 h-25 bg-grayscale-5 rounded-full"></div>

      <h1 className="text-[2.1rem]/[2.4rem] my-5 font-cinzel text-center">Winter Wishlist Association</h1>

      <div className="w-full flex justify-center lowercase">
        <SwitchModeButton
          to="/signin"
          text="Sign In"
          side="left"
          selected={isSignin}
        />
        <SwitchModeButton
          to="/signup"
          text="Create Account"
          side="right"
          selected={!isSignin}
        />
      </div>

      {!isSignin && (
        <AccountTypeSelection
          value={accountType}
          setAccountType={setAccountType}
        />
      )}

      <form className="w-full flex flex-col" id="auth-form">
        <div className="flex flex-col gap-5">
          {!isSignin && (
            <LabeledInput
              labelText="Full Name"
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
        </div>
        <Link to="/forgot-password" className="self-end text-grayscale-1 mt-1">
          Forgot Password?
        </Link>

        {errorMessage && (
          <p className="self-center text-red-400">{errorMessage}</p>
        )}
      </form>

      <PrimaryButton
        text={isSignin ? "Sign In" : "Create Account"}
        form="auth-form"
        onClick={(e) => handleAuth(e)}
      />
    </AuthContainer>
  );
}
