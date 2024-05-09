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
    </div>
</template>

<script>
import { ref, watch } from 'vue';
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
    },
    mounted() {
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