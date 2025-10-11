import { generateSEOMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { Container } from "../components/Container";
import AuthFormContent from "./components/AuthFormContent";

export const metadata = generateSEOMetadata({
  title: "Sign In",
  description: "Sign in to your account to book and manage your vacation rentals.",
  noIndex: true,
});

export default function AuthForm() {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <AuthFormContent />
    </Suspense>
  );
}

function AuthFormFallback() {
  return (
    <Container>
      <div className="max-w-md mx-auto p-6 border rounded shadow">
        <h2 className="text-xl mb-4">Loading...</h2>
        <div className="flex flex-col gap-4">
          <div className="border p-2 rounded bg-gray-100 animate-pulse h-10"></div>
          <div className="border p-2 rounded bg-gray-100 animate-pulse h-10"></div>
          <div className="bg-gray-200 py-2 rounded animate-pulse h-10"></div>
        </div>
      </div>
    </Container>
  );
}
