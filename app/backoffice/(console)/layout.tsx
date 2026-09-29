import { ConsoleShell } from "@/components/backoffice/ConsoleShell";

// Every console page is client-rendered against the API; the shell gates on the admin session.
export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleShell>{children}</ConsoleShell>;
}
