# ProseMirror x LDML.de Prototype

This repository contains a rudimentary implementation of a [ProseMirror](https://prosemirror.net/) editor that supports reference documentation in LDML.de.

## Usage

Try the prototype at <https://andreasphil.github.io/hello-prosemirror-ldmlde>.

You'll find the editor with some example content on the left side, and the output as JSON and HTML on the right side.

Press highlight some text and <kbd>CTRL+R</kbd> to create a ref. Changing attributes of the refs or removing them is currently not supported, but should be straightforward to implement.

## Notes

> [!NOTE]
>
> The general evaluation results can be found on our discovery Miro. Below are just a few notes about technical implications of this appraoch, which are "good to know" but no arguments for or against it.

### Data input & output

Our current process for reference docs is to display an HTML-rendered version of the XML. When a user adds a reference, the reference is inserted in the equivalent position of the XML, and the XML is re-rendered. This requires a roundtrip to the server for rendering. But it has the advantage that we don't need to deserialize our HTML again into XML, and our editor does not require any deep understanding of the document structure.

With ProseMirror, we would need to

- define a [schema](https://prosemirror.net/docs/guide/#schema) that describes our document structure (i.e. this would need to be equivalent to the LDML.de XSD schema, either for full or partial documents depending on what the editor is needed for).

- serialize the XML into a format that ProseMirror understands, either JSON or HTML that can be parsed based on the schema. We could probably use the HTML-rendered XML for this.

- changes will be made to the ProseMirror internal document structure, which ProseMirror renders as HTML. We would need to deserialize this back into XML.

### Schema

See the [example schema here](./src/schema.ts).

ProseMirror apparently has some restrictions around [nesting inline elements](https://prosemirror.net/docs/guide/#doc). If we decide to go with ProseMirror, we would need to check cases where LDML.de nests inline elements in more detail and see if those cases could also be modeled with [marks](https://prosemirror.net/docs/ref/#model.MarkType).

The LEA editor builds on [Slate.js](https://docs.slatejs.org/) (React), which explicitly names this flat document model as an issue:

> Building complex, nested documents was impossible. Many editors were designed around simplistic "flat" documents, making things like tables, embeds and captions difficult to reason about and sometimes impossible.

ProseMirror in general seems to be able to support things like [tables](https://github.com/ProseMirror/prosemirror-tables) though.

### Is it a good idea to use ProseMirror for XML?

[According to the author:](https://discuss.prosemirror.net/t/is-prosemirror-the-right-choice-for-xml-documents/7941)

> Only if you have a specific XML schema that you want to provide editing for, and are prepared to figure out and implement editing UI for manipulating the parts of the schema that aren’t covered by standard WYSIWYG editing.

There have been some previous attempts at using ProseMirror for some fairly complex XML schemas:

- [ProseMirror as a generic XML editor](https://discuss.prosemirror.net/t/prosemirror-as-generic-xml-editor/769)
- [Converting XML schema to ProseMirror schema](https://discuss.prosemirror.net/t/converting-xml-schema-to-prosemirror-schema/1047)

My feeling after trying this with the prototype is that in our case it might be

- feasible and indeed quite straightforward for "snippet editors" that editor specific parts of the document (e.g. ref editor).

- rather complex for a generic editor that supports full LDML.de documents or large, very flexible content sections.
