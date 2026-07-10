import {
  createContext,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "../services/api";
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth";

const TOKEN_STORAGE_KEY = "opsflow_token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<AuthUser>;
  logout: () => void;
};

export const AuthContext =
  createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );

  async function login(
    credentials: LoginCredentials
  ): Promise<AuthUser> {
    const result = await apiRequest<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    localStorage.setItem(TOKEN_STORAGE_KEY, result.token);

    setToken(result.token);
    setUser(result.user);

    return result.user;
  }

  async function register(
    credentials: RegisterCredentials
  ): Promise<AuthUser> {
    const result = await apiRequest<AuthResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    localStorage.setItem(TOKEN_STORAGE_KEY, result.token);

    setToken(result.token);
    setUser(result.user);

    return result.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}