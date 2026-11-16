import type { User } from "firebase/auth";

export interface UserData {
  name: string;
  accountType: "participant" | "admin" | "volunteer";
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}
