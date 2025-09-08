"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Container } from "../components/Container";
import { signIn, signUp } from "./components/auth";

export default function AuthForm() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (redirectTo.includes("hosting")) {
      toast.error("You need to be logged in to host a listing");
    }
  }, [redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(userData.email, userData.password);
        if (error) {
          throw error;
        }

        toast.success("Logged in successfully!", { duration: 3000 });
        setTimeout(() => {
          router.replace(redirectTo);
          setLoading(false);
        }, 3000);
      } else {
        const { error: signUpError } = await signUp(userData.email, userData.password);

        if (signUpError) throw signUpError;

        toast.success("Please confirm your email", { duration: 10000 });
      }
    } catch (error) {
      toast.error((error as Error).message);
      setLoading(false);
    }
  };

  const handleChangeUserDate = (event: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    setUserData((prevData) => ({ ...prevData, [prop]: event.target.value }));
  };

  return (
    <Container>
      <div className="max-w-md mx-auto p-6 border rounded shadow">
        <h2 className="text-xl mb-4">{mode === "login" ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(event) => handleChangeUserDate(event, "email")}
            required
            className="border p-2 rounded"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(event) => handleChangeUserDate(event, "password")}
            required
            className="border p-2 rounded"
            minLength={6}
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading} className="bg-myGreenLight text-myGrayDark py-2 rounded disabled:opacity-50">
            {loading ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
          }}
          className="mt-4 text-sm underline text-myGrayDark"
        >
          {mode === "login" ? "Create an account" : "Have an account? Login"}
        </button>
      </div>
    </Container>
  );
}
