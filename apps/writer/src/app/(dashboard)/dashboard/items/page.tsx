import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ItemsContent } from "@/components/worldbuilding/items-content";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <ItemsContent />;
}
