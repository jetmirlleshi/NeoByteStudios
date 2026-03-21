"use client";

import { useEditor, EditorContent as TipTapEditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { EditorToolbar } from "./editor-toolbar";
import { EditorStatusBar } from "./editor-status-bar";
import { SceneSeparator, AuthorNote } from "./extensions";

interface EditorContentProps {
  chapterId: string;
  chapterNumber?: number;
  chapterTitle?: string;
  initialContent?: string;
  initialVersion?: number;
  onContentChange?: (json: string, html: string, wordCount: number) => void;
}

export function WriterEditor({
  chapterId,
  chapterNumber,
  chapterTitle,
  initialContent,
  initialVersion = 0,
  onContentChange,
}: EditorContentProps) {
  const { setReady, setDirty, setWordCount, setCurrentChapter } = useEditorStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Inizia a scrivere...",
      }),
      CharacterCount,
      Highlight.configure({ multicolor: false }),
      Typography,
      SceneSeparator,
      AuthorNote,
    ],
    content: initialContent ? JSON.parse(initialContent) : undefined,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none px-8 py-6 min-h-[calc(100vh-10rem)] focus:outline-none font-serif leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      const html = editor.getHTML();
      const words = editor.storage.characterCount?.words() ?? 0;
      setDirty(true);
      setWordCount(words);
      onContentChange?.(json, html, words);
    },
    onCreate: ({ editor }) => {
      const words = editor.storage.characterCount?.words() ?? 0;
      setWordCount(words);
      setReady(true);
    },
    immediatelyRender: false,
  });

  // Set current chapter in store
  useEffect(() => {
    setCurrentChapter(chapterId, initialVersion);
    return () => setCurrentChapter(null);
  }, [chapterId, initialVersion, setCurrentChapter]);

  // Update content when chapter changes (without triggering onUpdate)
  useEffect(() => {
    if (editor && initialContent) {
      const currentJson = JSON.stringify(editor.getJSON());
      if (currentJson !== initialContent) {
        editor.commands.setContent(JSON.parse(initialContent), { emitUpdate: false });
        setDirty(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only re-run when chapterId changes
  }, [editor, chapterId]);

  return (
    <div className="flex h-full flex-col">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <TipTapEditorContent editor={editor} />
      </div>
      <EditorStatusBar chapterTitle={chapterTitle} chapterNumber={chapterNumber} />
    </div>
  );
}
