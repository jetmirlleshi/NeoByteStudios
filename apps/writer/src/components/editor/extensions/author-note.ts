import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    authorNote: {
      setAuthorNote: () => ReturnType;
      toggleAuthorNote: () => ReturnType;
    };
  }
}

export const AuthorNote = Node.create({
  name: "authorNote",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      class: {
        default: "author-note",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-author-note]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-author-note": "" }),
      0,
    ];
  },

  addCommands() {
    return {
      setAuthorNote:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
      toggleAuthorNote:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
    };
  },
});
