import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ProjectsPageContent } from "@/components/projects/projects-page-content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <ProjectsPageContent />;
}
