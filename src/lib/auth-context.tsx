import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirebaseAuth,
  signInEmail,
  signUpEmail,
  signInGoogle,
  signOut,
  resetPassword,
  saveUserProfile,
  type User,
} from "./firebase";

/* ── Types ───────────────────────────────────────────────────────────────── */

type AuthState = {
  user: User | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  loginEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/* ── Provider ────────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // SSR guard — firebase auth is browser-only
    if (typeof window === "undefined") {
      setState({ user: null, loading: false });
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Save profile to RTDB on each login
        try {
          await saveUserProfile(user.uid, user);
        } catch {
          // Non-critical — don't block auth flow
        }
      }
      setState({ user, loading: false });
    });
    return unsub;
  }, []);

  async function loginEmail(email: string, password: string) {
    await signInEmail(email, password);
  }

  async function registerEmail(
    email: string,
    password: string,
    name?: string,
  ) {
    await signUpEmail(email, password, name);
  }

  async function loginGoogle() {
    await signInGoogle();
  }

  async function logout() {
    await signOut();
  }

  async function sendReset(email: string) {
    await resetPassword(email);
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginEmail,
        registerEmail,
        loginGoogle,
        logout,
        sendReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────────────────────────── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() must be used within <AuthProvider>");
  return ctx;
}
