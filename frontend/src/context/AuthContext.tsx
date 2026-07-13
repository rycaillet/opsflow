import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "../services/api";
import type {
  AuthResponse,
  AuthUser,
  CurrentUserResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth";

const TOKEN_STORAGE_KEY = "opsflow_token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<AuthUser>;
  updateUser: (user: AuthUser) => void;
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

  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    async function restoreSession() {
      setIsLoading(true);

      try {
        const result =
          await apiRequest<CurrentUserResponse>(
            "/auth/me",
            {
              token: token!,
            }
          );

        if (isActive) {
          setUser(result.user);
        }
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);

        if (isActive) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, [token]);

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

  function updateUser(updatedUser: AuthUser) {
    setUser(updatedUser);
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
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}