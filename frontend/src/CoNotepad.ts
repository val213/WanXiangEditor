// 使用Yjs和NotePad编辑器实现实时协作编辑
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { NotepadBinding } from './y-notepad';
import Notepad from './Notepad.vue';




window.addEventListener('load', () => {
    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider('wss://demos.yjs.dev', 'Nodepad', ydoc)
    const type = ydoc.getText('Notepad')
    const notepadbinding = new NotepadBinding(Notepad, ydoc, provider);

    // 这是一个JSDoc注释，用于给接下来的表达式提供类型信息。在这个例子中，它告诉TypeScript编译器，document.getElementById('y-connect-btn')的返回值应该被视为HTMLElement类型。这是一种类型断言，它可以让你覆盖TypeScript的类型推断
    const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'));
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            if (provider.shouldConnect) {
                provider.disconnect();
                connectBtn.textContent = 'Connect';
            } else {
                provider.connect();
                connectBtn.textContent = 'Disconnect';
            }
        });
    }
    // 将provider，ydoc，type，和notepadbinding这四个变量的值暴露到了全局范围，以便在其他地方使用
    // @ts-ignore
    window.example = { provider, ydoc, type, notepadbinding }
    
  })
  