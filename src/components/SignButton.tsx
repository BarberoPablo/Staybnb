import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export function SignButton() {
  const pathname = usePathname();
  const mode = pathname.includes("hosting") ? "hosting" : "traveling";
  const router = useRouter();
  const { user, loading } = useUser();

  const handleChangeMode = () => {
    if (mode === "hosting") {
      router.push("/");
    } else {
      router.push("/hosting");
    }
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  return !loading && user ? (
    <div>
      <button onClick={handleChangeMode}>Switch to {mode === "hosting" ? "traveling" : "hosting"}</button>
      <LogoutButton />
    </div>
  ) : (
    <button className="text-sm sm:text-xl hover:bg-amber-300 transition-colors duration-300 px-4 py-2 rounded-full" onClick={handleLogin}>
      Login
    </button>
  );
}
