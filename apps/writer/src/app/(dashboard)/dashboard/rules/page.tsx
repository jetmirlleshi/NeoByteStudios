import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { RulesContent } from "@/components/worldbuilding/rules-content";

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <RulesContent />;
}
