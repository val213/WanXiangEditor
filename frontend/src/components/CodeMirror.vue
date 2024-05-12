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
import { client } from '@/client'
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';

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
        // this.createSharedDoc();

        this.username = sessionStorage.getItem(this.nowTabKey + 'user');
        console.log("当前标签页拥有者: ", this.username);
        // console.log("当前key: ", this.nowTabKey);
        this.cooperativeCode = sessionStorage.getItem(this.nowTabKey + 'cooperateCode');
        // console.log("当前在线协作码: ", this.cooperativeCode);

        const ydoc = new Y.Doc();
        // const awareness = new awarenessProtocol.Awareness(ydoc);
        const roomName = this.username + '-' + this.cooperativeCode;
        console.log("房间名：",  roomName);
        const provider = new WebsocketProvider('ws://192.168.17.131:4000', roomName, ydoc);
        provider.connect();
        // 监听连接状态变化
        provider.on('status', (event) => {
            if (event.status === 'connected') {
                console.log('WebsocketProvider connected successfully');
                // 在连接成功后执行你的操作
                // 例如，通知用户连接成功或者执行其他初始化操作
            } else if (event.status === 'disconnected') {
                console.log('WebsocketProvider disconnected');
                // 连接断开时的处理逻辑
            } else if (event.status === 'connecting') {
                console.log('WebsocketProvider is connecting');
                // 连接建立中的处理逻辑
            }
        });
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
        this.ydoc = ydoc;
        this.awareness = awareness;
        this.yText = yText
        this.binding = binding
        this.yUndoManager = yUndoManager
    },
    methods: {
        // 创建新的共享文档
        async createSharedDoc() {
            
            // 两种消息类型
            const messageSync = 0; // 同步更新 
            const messageAwareness = 1; // 意识状态更新
            // const messageAuth = 2
            // 注册监听事件：监听共享文档的消息
            client.listenMsg('SharedDoc/UpdateDoc', call => {
                console.log("收到更新文档的消息: ", call.updatedDoc);
                // Y.applyUpdate(this.ydoc, call.updatedDoc);
                try {
                    const encoder = encoding.createEncoder(); // 编码器
                    const decoder = decoding.createDecoder(call.updatedDoc); // 解码器
                    const messageType = decoding.readVarUint(decoder); // 消息类型
                    switch (messageType) {
                        case messageSync:
                            console.log("同步消息");
                            encoding.writeVarUint(encoder, messageSync);
                            // 解析并处理同步消息
                            syncProtocol.readSyncStep1(decoder, encoder, this.doc);
                            // 如果encoder中包含了除了消息类型外的其他消息内容，则将其转换为Uint8Array
                            // 并使用send发送消息给连接的客户端
                            // if (encoding.length(encoder) > 1) {
                            // 	send(doc, conn, encoding.toUint8Array(encoder));
                            // }
                            break;
                        case messageAwareness: {
                            console.log("意识状态更新消息")
                            // 从解码器中读取awareness状态更新消息
                            // awarenessProtocol.applyAwarenessUpdate(
                            //     doc.awareness,
                            //     decoding.readVarUint8Array(decoder),
                            // );
                            break;
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            });


            let ret = await client.callApi('SharedDoc/CreateSharedDoc', {
                docName: "Test",
            });
            if (!ret.isSucc) {
                console.log("创建共享文档失败");
            }

            const yText = this.ydoc.getText('codemirror')
            const yUndoManager = new Y.UndoManager(yText, {
                trackedOrigins: new Set([])
            })

            const editorContainer = this.$refs.codemirrorRef
            const editor = CodeMirror(editorContainer, {
                mode: 'javascript',
                lineNumbers: true
            })

            // 设置当前客户端的用户名
            // const awareness = provider.awareness;
            // const user = awareness.getLocalState();
            // const curUn = this.currentUsername; // 当前编辑者
            // user.name = '编辑者: ' + curUn;
            // // 更新本地状态
            // awareness.setLocalState(user);
            // // 更新provider的awareness
            // provider.awareness.setLocalStateField('user', user);

            const binding = new CodemirrorBinding(yText, editor);
        }
    }
}
</script>
