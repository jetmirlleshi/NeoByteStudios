import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { SubplotsContent } from "@/components/worldbuilding/subplots-content";

export const dynamic = "force-dynamic";

export default async function SubplotsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <SubplotsContent />;
}
