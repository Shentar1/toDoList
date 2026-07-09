"use client";

import { userDTO } from "@/lib/services/usersModels";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
type UserData = {
  username: string;
  uuid?: string;
};
type AuthContextType = {
  user: UserData;
  login: (user: UserData) => Promise<UserData | null>;
  logout: () => void;
  getSession: () => Promise<UserData>;
};
const AuthContext = createContext<AuthContextType>({
  user: {
    username: "",
  },
  async login(user) {
    return null;
  },
  async logout() {},
  async getSession() {
    return { username: "", password: "" };
  },
});
export async function login(username: string, password: string) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok) {
    const data = (await response.json()) as userDTO;

    return { username: data.username, uuid: data.uuid };
  } else {
    return null;
  }
}
export async function logout() {
  console.log("logging out");
  const response = await fetch("/api/login", {
    method: "DELETE",
  });
  if (response.ok) {
    document.location.href = "/";
  }
}
export async function getSession() {
  const response = await fetch("/api/login");
  const data = (await response.json()) as userDTO;

  return {
    username: data.username,
    uuid: data.uuid,
  } as UserData;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>({ username: "" });
  async function login(userData: UserData): Promise<UserData | null> {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      const data = (await response.json()) as userDTO;
      userData.uuid = data.uuid;
      setUser(userData);
      return userData;
    } else {
      return null;
    }
  }
  async function logout() {
    console.log("logging out");
    setUser({ username: "", uuid: undefined });
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user.uuid),
    });
    if (response.ok) {
      document.location.href = "/";
    }
  }
  return (
    <AuthContext.Provider value={{ user, login, logout, getSession }}>
      {children}
    </AuthContext.Provider>
  );
}

//export const useAuth = () => useContext(AuthContext);
