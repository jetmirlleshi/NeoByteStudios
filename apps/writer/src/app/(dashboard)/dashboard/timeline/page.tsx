import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { TimelineContent } from "@/components/worldbuilding/timeline-content";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <TimelineContent />;
}
