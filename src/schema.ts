import { Schema } from "prosemirror-model";

export const quotedText = new Schema({
  nodes: {
    doc: {
      content: "quotedText",
    },
    quotedText: {
      content: "(text|ref)*",
      attrs: {
        GUID: { default: crypto.randomUUID() },
        eId: { default: null },
        startQuote: { default: "„" },
        endQuote: { default: "“" },
      },
      parseDOM: [
        {
          tag: "akn\\:quotedText",
          getAttrs: (dom) => ({
            GUID: dom.getAttribute("GUID"),
            eId: dom.getAttribute("eId"),
            startQuote: dom.getAttribute("startQuote"),
            endQuote: dom.getAttribute("endQuote"),
          }),
        },
        {
          tag: '[data-akn="quotedText"]',
          getAttrs: (dom) => ({
            GUID: dom.getAttribute("GUID"),
            eId: dom.getAttribute("eId"),
            startQuote: dom.getAttribute("startQuote"),
            endQuote: dom.getAttribute("endQuote"),
          }),
        },
      ],
      toDOM: (node) => {
        return [
          "p",
          {
            "data-akn": "quotedText",
            GUID: node.attrs.GUID,
            eId: node.attrs.eId,
            startQuote: node.attrs.startQuote,
            endQuote: node.attrs.endQuote,
          },
          0,
        ];
      },
    },
    ref: {
      inline: true,
      content: "text*",
      attrs: {
        GUID: { default: crypto.randomUUID() },
        eId: { default: null },
        href: { default: null },
      },
      parseDOM: [
        {
          tag: "akn\\:ref",
          getAttrs(dom) {
            return {
              GUID: dom.getAttribute("GUID"),
              eId: dom.getAttribute("eId"),
              href: dom.getAttribute("href"),
            };
          },
        },
        {
          tag: '[data-akn="ref"]',
          getAttrs(dom) {
            return {
              GUID: dom.getAttribute("GUID"),
              eId: dom.getAttribute("eId"),
              href: dom.getAttribute("href"),
            };
          },
        },
      ],
      toDOM: (node) => {
        return [
          "span",
          {
            "data-akn": "ref",
            GUID: node.attrs.GUID,
            eId: node.attrs.eId,
            href: node.attrs.href,
          },
          0,
        ];
      },
    },
    text: {
      inline: true,
    },
  },
});
