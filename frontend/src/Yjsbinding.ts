// YjsBinding.js
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export default class YjsBinding {
    notepad: any;
    doc: Y.Doc;
    ytext: Y.Text;
    provider: WebsocketProvider | null;

    constructor(notepad: any, doc: Y.Doc = new Y.Doc(), provider: WebsocketProvider | null = null) {
        this.notepad = notepad;
        this.doc = doc;
        this.ytext = this.doc.getText('shared');
        this.provider = provider || new WebsocketProvider('ws://localhost:1234', 'my-room', this.doc);

        this.ytext.observe(() => {
            this.notepad.content = this.ytext.toString();
        });

        this.notepad.onContentChange((newContent: any) => {
            this.doc.transact(() => {
                this.ytext.delete(0, this.ytext.length);
                this.ytext.insert(0, newContent);
            });
        });

        this.notepad.onSelectionChange(() => {
            // Handle selection change
        });
    }
    destroy() {
        this.provider?.destroy();
    }
}