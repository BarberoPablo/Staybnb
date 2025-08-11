"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn, signUp } from "./components/auth";

const supabase = createClient();

export default function AuthForm() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(userData.email, userData.password);
        if (error) {
          throw error;
        }

        setSuccessMsg("Logged in successfully!");
      } else {
        const { error: signUpError } = await signUp(userData.email, userData.password);

        if (signUpError) throw signUpError;

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password,
        });
        if (loginError) throw loginError;

        setSuccessMsg("Account created and logged in!");
      }

      router.replace(redirectTo);
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserDate = (event: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    setUserData((prevData) => ({ ...prevData, [prop]: event.target.value }));
  };

  return (
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
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(event) => handleChangeUserDate(event, "password")}
          required
          className="border p-2 rounded"
          minLength={6}
        />
        <button type="submit" disabled={loading} className="bg-myGreen text-myGrayDark py-2 rounded disabled:opacity-50">
          {loading ? (mode === "login" ? "Logging in..." : "Registering...") : mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
      {successMsg && <p className="mt-4 text-myGrayDark">{successMsg}</p>}

      <button
        onClick={() => {
          setErrorMsg(null);
          setSuccessMsg(null);
          setMode(mode === "login" ? "register" : "login");
        }}
        className="mt-4 text-sm underline text-myGrayDark"
      >
        {mode === "login" ? "Create an account" : "Have an account? Login"}
      </button>
    </div>
  );
}
