import type { User } from "firebase/auth";

export type AccountType = "participant" | "admin" | "volunteer";

export interface UserData {
  uid: string;
  name: string;
  accountType: AccountType;
}

export interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
}

export interface Wish {
  itemName: string | undefined;
  matched: boolean | undefined;
  matchedDonationId: string | undefined;
}

export interface Wishlist {
  items: Wish[];
  participantId: string;
}
