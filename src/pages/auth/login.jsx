import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import SubmitButton from "@/components/authentication/SubmitButton";
import SimpleInput from "@/components/authentication/SimpleInput";

export default function Login() {
  const [usernameOrEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, status, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render the form if already authenticated
  if (status === "authenticated") {
    return null;
  }

  const onLogin = async () => {
    if (!usernameOrEmail || !password) {
      setError("Please enter both email/username and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: usernameOrEmail,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError(
            "Invalid email/username or password. Please check your credentials and try again."
          );
        } else {
          setError(result.error);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-50">
      <div className="w-96 min-w-80 px-2">
        <div className="my-4 flex flex-col gap-4 bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold">social-lens</h1>
              <p className="text-gray-500">closer together</p>
              <p className="text-xs text-gray-400 mt-1">
                A simple way to connect and share with friends.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-100 px-4 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-4 flex-col">
            <SimpleInput
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email, username or phone number"
              value={usernameOrEmail}
            />
            <SimpleInput
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              value={password}
            />
            <div className="w-full text-center text-sm">
              <Link href="/forgot-password" className="text-cyan-600">
                Forgot password?
              </Link>
            </div>
            <div onClick={onLogin}>
              <SubmitButton disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </SubmitButton>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-8 mt-4">
          <span className="text-center text-sm">
            <strong>Don't have an account?</strong>{" "}
            <Link className="text-cyan-600" href="/auth/register">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
