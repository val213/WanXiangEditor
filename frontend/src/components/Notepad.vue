<template>
    <div class="notepad">
        <!-- 左侧行数显示 -->
        <div class="line-numbers">
            <div v-for="line in lineIndex" :key="line" class="line">{{ line }}</div>
        </div>
        <!-- 右侧编辑区域 -->
        <div class="editor">
            <textarea v-model="content" @keydown="handleKeyDown" @input="handleInput" @click="handleClick">
                </textarea>
        </div>
        <div class="notepad">
        <!-- ... -->
        <button @click="saveContent">保存</button>
    </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
export default {
    props: {
        nowTabKey: String,
        title: String,
        content: String,
    },
    data() {
        return {
            content: '', // 文本内容
            lineIndex: 1, // 行数
            cursorLinePosition: 1, //光标所在行数
            isCursorAtLineStart: true, // 光标是否在行首
            isCursorAtLineEnd: true, // 光标是否在行尾
        };
    },

    setup(props) {
        const content = ref(props.content);
        watch(() => props.content, (newContent) => {
            content.value = newContent;
        });
        return {
            content
        }
    },
    methods: {
        getContent() {
        // 返回编辑器的内容
            return this.content;
        },
        setContent(content) {
        // 设置编辑器的内容
            this.content = content;
        },
        getSelection() {
        // 返回编辑器的当前选择范围
            const textarea = this.$refs.textarea;
            return {
                start: textarea.selectionStart,
                end: textarea.selectionEnd
            };
        },
        setSelection(selection) {
            // 设置编辑器的选择范围
            const textarea = this.$refs.textarea;
            textarea.setSelectionRange(selection.start, selection.end);
        },
        onContentChange(callback) {
            // 注册一个回调函数，当编辑器的内容发生更改时，这个回调函数会被调用
            watch(() => this.content, callback);
        },
        onSelectionChange(callback) {
            // 注册一个回调函数，当编辑器的选择范围发生更改时，这个回调函数会被调用
            this.$refs.textarea.addEventListener('select', () => {
                callback(this.getSelection());
            });
        },
        // 处理光标
        handleCursor() {
            // 更新行数
            this.lineIndex = this.content.split('\n').length;
            // console.log("行数：",this.content.split('\n').length);

            /*// 获取光标位置
            const cursorPosition = event.target.selectionStart;
            // 获取所在行数
            const contentBeforeCursor = this.content.substring(0, cursorPosition);
            const lineNumber = contentBeforeCursor.split('\n').length;
            // console.log("光标所在行数：", lineNumber);
            this.cursorLinePosition = lineNumber;
            // 判断光标是否在行首
            const lastLineBreakIndex = contentBeforeCursor.lastIndexOf('\n');
            const lineStartIndex = lastLineBreakIndex === -1 ? 0 : lastLineBreakIndex + 1;
            const isAtLineStart = cursorPosition === 0 || cursorPosition === lineStartIndex;
            // console.log("光标是否在行首：", isAtLineStart);
            this.isCursorAtLineStart = isAtLineStart;
            // 判断光标是否在行尾
            const lineEndIndex = this.content.indexOf('\n', cursorPosition);
            const isAtLineEnd = lineEndIndex === -1 || cursorPosition === lineEndIndex;
            // console.log("光标是否在行尾：", isAtLineEnd);*/
        },
        // 处理键盘按下事件
        /*handleKeyDown() {
            // 判断按下的键是否为回车键
            // if (event.keyCode == 13) {
            // }
            // 判断按下的键是否为退格键
            // else if (event.keyCode == 8) {
            // }
        },*/
        // 处理输入事件
        handleInput() {
            // 将当前数据存入sessionStorage
            sessionStorage.setItem(this.nowTabKey, this.content);
        },
        // 处理点击事件
        // handleClick() {
        // }

        // 保存内容
        // 用多步骤弹出框，先让用户选择确定是否保存当前所在的文件，用户确定保存后再继续选择保存到服务器或者保存本地副本，但这两种选择都需要调用各自的函数
        async saveContent() {
            const { value } = await Swal.fire({
            title: '请选择保存方式',
            input: 'radio',
            inputOptions: {
                'server': '保存到服务器',
                'local': '保存本地副本',
                'cancel': '取消',
            },
            inputValidator: (value) => {
                if (!value) {
                    return '你需要选择一个选项！'
                }
            }
        });

        if (value === 'server') {
            this.saveToServer(this.content);
        } else if (value === 'local') {
            this.saveToLocal(this.content);
        } else if (value === 'cancel') {
            // 用户选择了取消
            console.log('User cancelled');
        }
    },
        // 保存到本地
        saveToLocal(content, title) {
            const downloadFile = async (content, type, title)=> {
                let blob = new Blob([content], {type: type});
                let url = URL.createObjectURL(blob);
                let link = document.createElement('a');
                link.download = title;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                client.logger.info('成功下载文件');
                Modal.success({
                title: '下载文件成功',
                content: '文件已经下载到本地。',
                });
            };
            const handleFileDownload = async (content, title)=> {
                // 首先判断文件的类型
                let parts = title.split(".");
                let extension = parts.pop();
                const textExtensions = ['txt', 'md', 'json', 'js', 'html', 'css', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go', 'php', 'sql', 'sh', 'bat', 'xml', 'yaml', 'yml', 'ini', 'conf', 'cfg', 'log', 'properties', 'gradle', 'pdf'];
                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
                const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'];

                if (textExtensions.includes(extension)) {
                    downloadFile(content, 'text/plain;charset=utf-8', title);
                } else if (imageExtensions.includes(extension)) {
                    downloadFile(content, 'image/jpeg', title);
                } else if (extension === 'pdf') {
                    downloadFile(content, 'application/pdf', title);
                } else if (archiveExtensions.includes(extension)) {
                    downloadFile(content, 'application/zip', title);
                } else {
                    client.logger.info('不支持该文件类型', title);
                    Modal.error({
                    title: '不支持该文件类型,请选择文本格式文件~',
                    content: '暂时不支持该文件类型的下载，因为它要么是二进制文件，要么使用不受支持的文本编码。',
                    });
                }
            };
            handleFileDownload(content, title);
        },
        // 保存到服务器
        async saveToServer(content) {
            let ret = await client.callApi('SaveFile', { content: content });

        },
    },
    mounted() {
        // 监听content的变化
        watch(() => this.content, this.handleCursor);
    }
};
</script>

<style scoped>
/* notepad组件 */
.notepad {
    display: flex;
    height: 100%;
}

/* 左侧行数显示 */
.line-numbers {
    flex-shrink: 0;
    /* 不随着内容而扩展 */
    padding: 20px;
    height: 100%;
    /* border-right: 1px solid #ccc; */
}

/* 行数样式 */
.line {
    font-size: 14px;
    line-height: 20px;
    min-width: 20px;
    text-align: right;
    color: #888;
}

.editor {
    flex-grow: 1;
    /* 随着内容而扩展 */
    padding: 10px;
    margin-top: 8px;
    /* 上方的间距 */
}

textarea {
    width: 100%;
    height: 100%;
    resize: none;
    /* 禁止调整大小 */
    border: none;
    outline: none;
    font-size: 14px;
    line-height: 20px;
}
</style>