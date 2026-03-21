import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ChapterEditorContent } from "@/components/editor/chapter-editor-content";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ projectId: string; chapterId: string }>;
};

export default async function ChapterEditorPage({ params }: Props) {
  const { data: session } = await auth.getSession();
  if (!session) redirect("/auth/sign-in");

  const { projectId, chapterId } = await params;

  return (
    <ChapterEditorContent projectId={projectId} chapterId={chapterId} />
  );
}
