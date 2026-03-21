import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { RelationshipsContent } from "@/components/worldbuilding/relationships-content";
import { ProjectSelector } from "@/components/dashboard/project-selector";

export const dynamic = "force-dynamic";

export default async function RelationshipsPage() {
  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <ProjectSelector>
      {(projectId) => <RelationshipsContent projectId={projectId} />}
    </ProjectSelector>
  );
}
