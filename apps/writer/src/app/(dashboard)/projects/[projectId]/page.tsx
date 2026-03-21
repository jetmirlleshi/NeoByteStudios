import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/sign-in");

  const { projectId } = await params;

  return <ProjectDetailContent projectId={projectId} />;
}
