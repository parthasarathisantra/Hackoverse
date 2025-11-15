import { createContext, useContext, useEffect, useState } from "react";
import { signup as apiSignup, login as apiLogin, getUser } from "@/services/api";

interface UserData {
  username: string;
  bio: string;
  skills: any[];
  level: number;
  xp: number;
  email?: string;
}

interface AuthContextType {
  currentUser: { uid: string; email: string } | null;
  userData: UserData | null;
  loading: boolean;

  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: () => {},
  refreshUserData: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const email = localStorage.getItem("email");

    if (uid && email) {
      setCurrentUser({ uid, email });
      refreshUserData(uid);
    } else {
      setLoading(false);
    }
  }, []);

  // ------------------------------------
  // FETCH USER PROFILE FROM BACKEND
  // ------------------------------------
  const refreshUserData = async (forcedUid?: string) => {
    const uid = forcedUid || currentUser?.uid;
    if (!uid) return;

    try {
      const res = await getUser(uid);
      const data = res.data;

      setUserData({
        username: data.username,
        bio: data.bio || "",
        skills: data.skills || [],
        level: data.level || 1,
        xp: data.xp || 0,
        email: data.email,
      });

      localStorage.setItem("username", data.username);

    } catch (err) {
      console.error("Failed to refresh user:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // SIGNUP
  // ------------------------------------
  const signup = async (email: string, password: string) => {
    const res = await apiSignup(email, password);
    const uid = res.data.uid;

    localStorage.setItem("uid", uid);
    localStorage.setItem("email", email);

    setCurrentUser({ uid, email });

    await refreshUserData(uid);
  };

  // ------------------------------------
  // LOGIN
  // ------------------------------------
  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    const uid = res.data.uid;

    localStorage.setItem("uid", uid);
    localStorage.setItem("email", email);

    setCurrentUser({ uid, email });

    await refreshUserData(uid);
  };

  // ------------------------------------
  // LOGOUT
  // ------------------------------------
  const logout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("email");
    localStorage.removeItem("username");

    setCurrentUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        loading,
        signup,
        login,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
