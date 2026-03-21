import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/settings/settings-content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <SettingsContent
      userName={session.user.name ?? "Utente"}
      userEmail={session.user.email ?? ""}
    />
  );
}
