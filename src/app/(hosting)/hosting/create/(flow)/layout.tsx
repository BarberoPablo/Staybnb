"use client";

import { hostingSteps } from "@/lib/types/hostingSteps";
import { usePathname, useRouter } from "next/navigation";

export default function HostingCreateListingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < hostingSteps.length - 1;

  const goBack = () => {
    if (canGoBack) router.push(`/hosting/create/${hostingSteps[currentStepIndex - 1]}`);
  };

  const goNext = () => {
    if (canGoNext) router.push(`/hosting/create/${hostingSteps[currentStepIndex + 1]}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <main className="flex-1 flex justify-center px-4 py-8 w-full max-w-2xl">{children}</main>

      <div className="fixed bottom-0 left-0 w-full border-t border-gray-200 px-4 py-3 flex justify-center">
        <div className="flex w-full justify-between items-center max-w-2xl">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="font-medium px-8 py-3.5 border rounded-lg bg-black opacity-80 text-white disabled:opacity-30 hover:opacity-100"
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="font-medium px-8 py-3.5 border rounded-lg bg-black opacity-80 text-white disabled:opacity-30 hover:opacity-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
