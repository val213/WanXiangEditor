import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import * as error from 'lib0/error'
import { createMutex } from 'lib0/mutex'
import { Awareness } from 'y-protocols/awareness' // eslint-disable-line

export class NotepadBinding {
    notepad: any;
    doc: Y.Doc;
    ytext: Y.Text;
    provider: WebsocketProvider | null;

    constructor(notepad: any, doc: Y.Doc, provider: WebsocketProvider | null = null) {
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
            if (this.provider) {
                this.provider.awareness.setLocalStateField('selection', this.notepad.selection);
            }
        });
    }
    destroy() {
        this.provider?.destroy();
    }
}