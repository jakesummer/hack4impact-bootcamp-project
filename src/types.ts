import type { User } from "firebase/auth";

export type AccountType = "participant" | "admin" | "volunteer";

export interface UserData {
  name: string;
  accountType: AccountType;
}

export interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
}
