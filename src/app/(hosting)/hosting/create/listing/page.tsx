import { hostingSteps } from "@/lib/types/hostingSteps";
import { redirect } from "next/navigation";

// To avoid having "/hosting/create" as an empty URL
export default function CreateRedirectPage() {
  redirect(`/hosting/create/listing/${hostingSteps[0]}`);
}
