"use client";

import { api } from "@/lib/api/api";
import { hostingSteps } from "@/lib/types/hostingSteps";
import { useListingForm } from "@/store/useListingForm";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import toast from "react-hot-toast";

export default function HostingCreateListingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < hostingSteps.length - 1;

  const listingData = useListingForm((state) => state);
  const resetForm = useListingForm((state) => state.reset);

  const goBack = () => {
    if (canGoBack) router.push(`/hosting/create/${hostingSteps[currentStepIndex - 1]}`);
  };

  const goNext = () => {
    if (canGoNext) router.push(`/hosting/create/${hostingSteps[currentStepIndex + 1]}`);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.createListing(listingData);

      if (!response.success) {
        toast.error("Failed to create listing");
        throw new Error("Failed to create listing");
      }

      toast.success("Listing created");
      setTimeout(() => {
        resetForm();
        router.push("/hosting");
      }, 2000);
    } catch (error) {
      toast.error("Failed to create listing");
      console.error("Error submitting listing:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <main className="flex-1 flex justify-center px-4 py-8 w-full max-w-2xl">{children}</main>

      <div className="sticky bottom-0 left-0 w-full border-t border-gray-200 px-4 py-3 flex justify-center bg-background">
        <div className="flex w-full justify-between items-center max-w-2xl">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="font-medium px-8 py-3.5 border rounded-lg bg-black opacity-80 text-white disabled:opacity-30 hover:opacity-100"
          >
            Back
          </button>
          <button
            onClick={canGoNext ? goNext : handleSubmit}
            className="font-medium px-8 py-3.5 border rounded-lg bg-black opacity-80 text-white disabled:opacity-30 hover:opacity-100"
          >
            {canGoNext ? "Next" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
