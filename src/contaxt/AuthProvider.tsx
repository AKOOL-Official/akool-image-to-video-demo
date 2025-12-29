import { createContext, useState } from "react";

type AuthType = "token" | "apiKey";

export interface AuthState {
  type: AuthType;
  credential: string;
}

export const AuthContext = createContext<{
  auth: AuthState | null;
  setAuth: (a: AuthState | null) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}>({ auth: null, setAuth: () => {}, authError: null, setAuthError: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
