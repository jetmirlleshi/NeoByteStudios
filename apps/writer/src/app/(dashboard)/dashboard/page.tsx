import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <DashboardContent
      userName={session.user.name ?? session.user.email ?? "Scrittore"}
    />
  );
}
