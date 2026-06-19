import { AppShell } from "@/components/layout/app-shell";
import { getSessionUser } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  return <AppShell user={user}>{children}</AppShell>;
}
