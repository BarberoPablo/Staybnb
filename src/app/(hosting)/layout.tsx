import AuthGuard from "../(site)/auth/components/AuthGuard";

export default function HostingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard>{children}</AuthGuard>;
}
