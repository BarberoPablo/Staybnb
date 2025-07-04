export default function CreateListingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow">{children}</main>
    </div>
  );
}
