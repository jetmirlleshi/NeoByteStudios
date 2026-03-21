import { Node, mergeAttributes, InputRule } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    sceneSeparator: {
      setSceneSeparator: () => ReturnType;
    };
  }
}

export const SceneSeparator = Node.create({
  name: "sceneSeparator",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      { tag: "hr[data-scene-separator]" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "hr",
      mergeAttributes(HTMLAttributes, {
        "data-scene-separator": "",
        class: "scene-separator",
      }),
    ];
  },

  addCommands() {
    return {
      setSceneSeparator:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name })
            .createParagraphNear()
            .run();
        },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^(\*\*\*|---|===)$/,
        handler: ({ state, range, chain }) => {
          chain().deleteRange(range).setSceneSeparator().run();
        },
      }),
    ];
  },
});
