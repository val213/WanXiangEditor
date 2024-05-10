<template>
    <div>
      <div ref="codemirrorRef"></div>
    </div>
</template>


<script>
import * as Y from 'yjs'
import { CodemirrorBinding } from '/src/y-codemirror.js'
import { WebsocketProvider } from 'y-websocket'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'

export default {
    props: {
        nowTabKey: String,
        currentUsername: String,
    },
    data() {
        return {
            username: '',
            cooperativeCode: ''
        }
    },
    mounted() {
        console.log("CodeMirror is mounted");
        this.username = sessionStorage.getItem(this.nowTabKey + 'user');
        console.log("当前标签页拥有者: ", this.username);
        // console.log("当前key: ", this.nowTabKey);
        this.cooperativeCode = sessionStorage.getItem(this.nowTabKey + 'cooperateCode');
        // console.log("当前在线协作码: ", this.cooperativeCode);

        const ydoc = new Y.Doc()
        const roomName = this.username + '-' + this.cooperativeCode;
        console.log("房间名：",  roomName);
        const provider = new WebsocketProvider('ws://192.168.17.131:3000', '不同浏览器测试', ydoc)
        if (cooperativeCode != '') {
            provider.connect()
        }
        // provider.disconnect();
        const yText = ydoc.getText('codemirror')
        const yUndoManager = new Y.UndoManager(yText, {
        trackedOrigins: new Set([])
        })

        const editorContainer = this.$refs.codemirrorRef
        const editor = CodeMirror(editorContainer, {
        mode: 'javascript',
        lineNumbers: true
        })

        // 设置当前客户端的用户名
        const awareness = provider.awareness;
        const user = awareness.getLocalState();
        const curUn = this.currentUsername; // 当前编辑者
        user.name = '编辑者: ' + curUn;
        // 更新本地状态
        awareness.setLocalState(user);
        // 更新provider的awareness
        provider.awareness.setLocalStateField('user', user);

        const binding = new CodemirrorBinding(yText, editor, provider.awareness, {
            yUndoManager
        })

        this.provider = provider
        this.ydoc = ydoc
        this.yText = yText
        this.binding = binding
        this.yUndoManager = yUndoManager
    },
}
</script>
