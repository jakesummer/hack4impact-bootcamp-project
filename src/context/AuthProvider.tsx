import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.ts";
import { AuthContext } from "./AuthContext.tsx";
import type { UserData } from "../types.ts";
import { doc, getDoc } from "firebase/firestore";

interface AuthProviderProps {
  children: React.ReactElement;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const snapshot = await getDoc(doc(db, "users", user.uid));
          setUserData({ ...(snapshot.data() as UserData), uid: user.uid });
        } catch (e) {
          console.error(e);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, userData, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
