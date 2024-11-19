import { keymap } from "prosemirror-keymap";
import {
  DOMSerializer,
  Fragment,
  NodeType,
  DOMParser as ProseMirrorDOMParser,
} from "prosemirror-model";
import { Command, EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { quotedText } from "./schema";
import "./style.css";

let editorState: EditorState | null = null,
  editorView: EditorView | null,
  json = "",
  html = "";

function wrapTextInNode(node: NodeType) {
  const command: Command = (state, dispatch) => {
    const { from, to, empty } = state.selection;
    if (empty) return false;

    const selection = state.doc.textBetween(from, to);
    const newNode = node.create({}, quotedText.text(selection));
    dispatch?.(state.tr.replaceRangeWith(from, to, newNode));

    return true;
  };

  return command;
}

const editorKeymap = keymap({
  "Ctrl-r": wrapTextInNode(quotedText.nodes.ref),
});

function onDispatchTransaction(tr: Transaction) {
  const next = editorView!.state.apply(tr);
  editorView!.updateState(next);
  syncState(next);

  console.log(editorView?.state.doc);
}

function serializeToString(doc: Fragment): string {
  const serializer = DOMSerializer.fromSchema(quotedText);
  const fragment = serializer.serializeFragment(doc);
  const temp = document.createElement("div");
  temp.appendChild(fragment);
  return temp.innerHTML;
}

function syncState(state: EditorState) {
  json = JSON.stringify(state.toJSON(), undefined, 2);
  html = serializeToString(state.doc.content);

  document.querySelector("aside")!.textContent = json;
  document.querySelector("output")!.textContent = html;
}

async function init() {
  // Fetch example document
  const response = await fetch("./doc.html");
  if (!response.ok) throw new Error(response.statusText);

  // Convert into DOM for prosemirror
  const rawXml = await response.text();
  const xmlDOM = new DOMParser().parseFromString(rawXml, "application/xml");
  const startDoc = ProseMirrorDOMParser.fromSchema(quotedText).parse(xmlDOM);

  editorState = EditorState.create({
    schema: quotedText,
    doc: startDoc,
    plugins: [editorKeymap],
  });

  editorView = new EditorView(document.getElementById("editor"), {
    state: editorState,
    dispatchTransaction: onDispatchTransaction,
  });

  syncState(editorView.state);
}

init();
