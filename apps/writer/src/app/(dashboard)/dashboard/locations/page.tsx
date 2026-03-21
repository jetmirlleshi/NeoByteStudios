import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { LocationsContent } from "@/components/worldbuilding/locations-content";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <LocationsContent />;
}
