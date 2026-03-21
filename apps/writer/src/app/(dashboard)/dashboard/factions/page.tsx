import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { FactionsContent } from "@/components/worldbuilding/factions-content";

export const dynamic = "force-dynamic";

export default async function FactionsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <FactionsContent />;
}
