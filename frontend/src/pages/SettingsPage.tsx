import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../services/api";
import type { AuthUser } from "../types/auth";

type ProfileResponse = {
  user: AuthUser;
};

type PasswordResponse = {
  message: string;
};

function formatRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatDate(date?: string) {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, token, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [isSavingProfile, setIsSavingProfile] =
    useState(false);
  const [profileMessage, setProfileMessage] =
    useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [isChangingPassword, setIsChangingPassword] =
    useState(false);
  const [passwordMessage, setPasswordMessage] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setProfileError("You must be logged in.");
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileMessage("");
      setProfileError("");

      const result = await apiRequest<ProfileResponse>(
        "/auth/profile",
        {
          method: "PATCH",
          token,
          body: JSON.stringify({
            name,
          }),
        }
      );

      updateUser(result.user);
      setName(result.user.name);
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!token) {
      setPasswordError("You must be logged in.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);

      const result = await apiRequest<PasswordResponse>(
        "/auth/password",
        {
          method: "PATCH",
          token,
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      setPasswordMessage(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to update password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  }

  function handleSignOut() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account information and security."
      />

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the name displayed throughout your workspace.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="mt-6 space-y-5"
        >
          <Input
            label="Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            disabled={isSavingProfile}
            required
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Email
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Role
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {formatRole(user.role)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Member Since
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {profileError && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {profileError}
            </p>
          )}

          {profileMessage && (
            <p
              role="status"
              className="text-sm font-medium text-green-700"
            >
              {profileMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              isSavingProfile ||
              !name.trim() ||
              name.trim() === user.name
            }
          >
            {isSavingProfile
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <KeyRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Use a password that is different from your current one.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-6 space-y-4"
        >
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            disabled={isChangingPassword}
            autoComplete="current-password"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              disabled={isChangingPassword}
              autoComplete="new-password"
              required
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              disabled={isChangingPassword}
              autoComplete="new-password"
              required
            />
          </div>

          {passwordError && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p
              role="status"
              className="text-sm font-medium text-green-700"
            >
              {passwordMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              isChangingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
          >
            {isChangingPassword
              ? "Updating..."
              : "Update Password"}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Sign Out
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              End your current OpsFlow session.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </Card>
    </div>
  );
}