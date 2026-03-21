import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { AnalyticsContent } from "@/components/analytics/analytics-content";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <AnalyticsContent />;
}
