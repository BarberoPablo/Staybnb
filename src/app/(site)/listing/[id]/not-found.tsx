import { GoBackButton } from "@/components/Booking/GoBackButton";

export default function NotFound() {
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold text-myGrayDark mb-2">Listing Not Found</h1>
      <p className="text-myGray">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      <GoBackButton />
    </div>
  );
}
