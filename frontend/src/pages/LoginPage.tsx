import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { apiRequest } from "../services/api";

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("ryan@example.com");
  const [password, setPassword] = useState("Password123!");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const result = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("opsflow_token", result.token);

      setMessage(`Logged in as ${result.user.name}`);

      navigate("/");
    } catch {
      setMessage("Login failed.");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-slate-900">
        Sign in
      </h1>

      <p className="mt-2 text-slate-600">
        Access your OpsFlow workspace.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      {message && (
        <p className="mt-4 text-sm font-medium text-slate-700">
          {message}
        </p>
      )}
    </Card>
  );
}