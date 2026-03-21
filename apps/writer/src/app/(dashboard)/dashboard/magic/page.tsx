import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { MagicContent } from "@/components/worldbuilding/magic-content";
import { ProjectSelector } from "@/components/dashboard/project-selector";

export const dynamic = "force-dynamic";

export default async function MagicPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <ProjectSelector>
      {(projectId) => <MagicContent projectId={projectId} />}
    </ProjectSelector>
  );
}
