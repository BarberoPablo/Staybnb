import { Suspense } from "react";
import { Container } from "../../components/Container";
import { AuthCallbackContent } from "./components/AuthCallbackContent";

export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackFallback() {
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
