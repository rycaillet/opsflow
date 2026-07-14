import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";


export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("ryan@example.com");
  const [password, setPassword] = useState("Password123!");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:5001/api";

    fetch(`${apiBaseUrl}/health`).catch(() => {
    // The login request will still show an error if the API is unavailable.
    });
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setIsSubmitting(true);

    try {
      await login({
        email,
        password,
      });

      navigate("/");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        Sign in
      </h1>

      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Access your OpsFlow workspace.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          autoComplete="email"
          required
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
          ? "Starting demo workspace..."
          : "Sign in"}
        </Button>

        {isSubmitting && (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          The free demo server may take up to a minute to wake up.
          </p>
        )}

      </form>

      {message && (
        <p
          role="alert"
          className="mt-4 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {message}
        </p>
      )}
    </Card>
  );
}