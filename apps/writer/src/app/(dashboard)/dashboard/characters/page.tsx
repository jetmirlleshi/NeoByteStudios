import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { CharactersContent } from "@/components/worldbuilding/characters-content";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <CharactersContent />;
}
