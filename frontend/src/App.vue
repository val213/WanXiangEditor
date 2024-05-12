<template>
    <a-layout>
        <div id="app" style="display: flex; flex-direction: column; height: 100vh;" class="WorkBench">
            <a-layout-header>
                <a-space :size="970" direction="horizontal" fill align="center">
                    <Menu />
                    <HeadPortrait ref="headPortrait" @login-success="handleLoginSuccess" />
                </a-space>
            </a-layout-header>
            <a-layout>
                <a-layout-sider :width="70">
                    <SideMenu :CurrentItem="CurrentComponent" @componentChange="componentChange" />
                </a-layout-sider>
                <a-layout-sider :resize-directions="['right']" :style="{ maxWidth: '80%', textAlign: 'center' }">
                    <KeepAlive>
                        <component :is="CurrentComponentSider" :tabKey="tabKey" :username="currentUsername"
                            @file-selected="handleFileSelected" @pdfView="pdfView"></component>
                    </KeepAlive>
                </a-layout-sider>
                <a-layout-content>
                    <a-dropdown trigger="contextMenu" alignPoint :style="{ display: 'block' }" @select="handleSelect">
                        <Tabs ref="tabsRef" :nowTabKey="nowTabKey" @tab-click="changeKey" @tab-add="changeKey"
                            @tab-del="changeToLastKey" @updateTitle="updataSharedTitle" />
                        <template #content>
                            <a-doption>创建多人协作文件</a-doption>
                            <a-doption>加入多人协作文件</a-doption>
                        </template>
                        <a-modal v-model:visible="createSharedFile" title="创建多人协作文件" @cancel="handleCreatedCancel"
                            @before-ok="handleCreatedFileBeforeOk">
                            <a-form ref="formRef" :model="form" size="large" :scroll-to-first-error="true">
                                <a-form-item field="filename" label="文件名" :rules="[{ required: true, message: '请先输入文件名'}]" >
                                    <a-input v-model="form.filename" />
                                </a-form-item>
                                <a-form-item field="cooperativeCode" label="在线协作码" :rules="[{ required: true, message: '请先输入在线协作码'}]">
                                    <a-input v-model="form.cooperativeCode" />
                                </a-form-item>
                            </a-form>
                        </a-modal>
                        <a-modal v-model:visible="joinSharedFile" title="加入多人协作文件" @cancel="handleJoinCancel"
                            @before-ok="handleJoinBeforeOk">
                            <a-form ref="joinFileFromref" :model="joinSharedFileForm" size="large" :scroll-to-first-error="true">
                                <a-form-item field="username" label="用户名" :rules="[{required:true,message:'请先输入用户名'}]">
                                    <a-input v-model="joinSharedFileForm.username" placeholder="请输入用户名……"/>
                                </a-form-item>
                                <a-form-item field="cooperativeCode" label="在线协作码" :rules="[{required:true,message:'请先输入在线协作码'}]">
                                    <a-input v-model="joinSharedFileForm.cooperativeCode" placeholder="请输入在线协作码……"/>
                                </a-form-item>
                            </a-form>
                        </a-modal>
                    </a-dropdown>
                    <Notepad v-if="CurrentComponentContent === 'Notepad'" :nowTabKey="nowTabKey"
                        :title="sharedTitle" :content="content" ref="childComponentRef">
                    </Notepad>
                    <PDFViewer v-if="CurrentComponentContent === 'PDFViewer'" ref="pdfViewerRef"  :pdfSource="pdfSource" :changeFlag="changeFlag">
                    </PDFViewer>
                    <CodeMirror v-if="CurrentComponentContent === 'CodeMirror'" ref="codemirrorRef" :nowTabKey="nowTabKey" :currentUsername="currentUsername">
                    </CodeMirror>
                </a-layout-content>
            </a-layout>
            <a-layout-footer>
                <Statusbar />
            </a-layout-footer>
        </div>
    </a-layout>
</template>

<script>
import Statusbar from './components/Statusbar.vue';
import Tabs from './components/Tabs.vue';
import Explorer from './components/Explorer.vue';
// import Editor from './components/BasicEditor.vue';
import Menu from './components/Menu.vue';
import SideMenu from './components/SideMenu.vue';
import Search from './components/Search.vue';
import HeadPortrait from './components/HeadPortrait.vue';
import Notepad from './components/Notepad.vue';
import FileUpload from './components/FileUpload.vue';
import PDFLoader from './components/PDFLoader.vue';
import PDFViewer from './components/PDFViewer.vue';
import { client } from './client';
import { ref, reactive } from 'vue';
import  CodeMirror from './components/CodeMirror.vue';
import { Modal } from '@arco-design/web-vue';
export default {
    name: 'App',
    components: {
        Statusbar,
        Tabs,
        Explorer,
        // Editor,
        Menu,
        SideMenu,
        Search,
        HeadPortrait, // 头像组件
        Notepad, // 记事本组件
        FileUpload,
        PDFLoader,
        PDFViewer,
        CodeMirror,
    },
    setup() {
        const tabsRef = ref(null);
        const PDFViewerRef = ref(null);
        const codemirrorRef = ref(null);
        const formRef = ref(null);
        const joinFileFromref = ref(null);
        const sharedTitle = ref('首页'); // 共享数据-标题
        const createSharedFile = ref(false);
        const joinSharedFile = ref(false);

        const form = reactive({
            filename: '',
            cooperativeCode: ''
        });
        const joinSharedFileForm = reactive({
            username: '',
            cooperativeCode: ''
        });

        const handleSelect = (key) => {
            if (key == '创建多人协作文件') {
                // console.log("创建多人协作文件");
                createSharedFile.value = true;
            } else if (key == '加入多人协作文件') {
                // console.log("加入多人协作文件");
                joinSharedFile.value = true;
            }
        };

        // 更新标签页标题
        const updataSharedTitle = (title) => {
            sharedTitle.value = title;
        };

        // 处理创建多人协作文件的确认事件
        const handleCreatedFileBeforeOk = (done) => {
            // console.log(form)

            // 创建成功
            if (tabsRef.value) {
                tabsRef.value.handleAdd(form.filename, '', "CodeMirror", form.cooperativeCode);
                createSharedFile.value = false;
                formRef.value.resetFields();
                formRef.value.clearValidate();
                done()
                return;
            }

            window.setTimeout(() => {
                done(false)
            }, 3000)
        };

        const handleCreatedCancel = () => {
            createSharedFile.value = false;
            formRef.value.resetFields();
            formRef.value.clearValidate();
        }

        // 处理加入多人协作文件的确认事件
        const handleJoinBeforeOk = (done) => {
            // console.log(form)

            // 加入成功
            if (tabsRef.value) {
                tabsRef.value.handleAdd('拥有者: ' + joinSharedFileForm.username, '',"CodeMirror", joinSharedFileForm.cooperativeCode, joinSharedFileForm.username);
                createSharedFile.value = false;
                joinFileFromref.value.resetFields();
                joinFileFromref.value.clearValidate();
                done()
                return;
            }

            window.setTimeout(() => {
                done(false)
            }, 3000)
        };

        const handleJoinCancel = () => {
            createSharedFile.value = false;
            joinFileFromref.value.resetFields();
            joinFileFromref.value.clearValidate();
        }

        return {
            tabsRef,
            PDFViewerRef,
            codemirrorRef,
            formRef,
            joinFileFromref,
            sharedTitle,
            createSharedFile,
            joinSharedFile,
            form,
            joinSharedFileForm,
            handleSelect,
            updataSharedTitle,
            handleCreatedFileBeforeOk,
            handleCreatedCancel,
            handleJoinBeforeOk,
            handleJoinCancel,
        };
    },
    data() {
        return {
            // 主组件的数据
            CurrentComponentContent: 'Notepad',
            CurrentComponentSider: 'Explorer',
            lastTabKey: '1',
            nowTabKey: '1',
            notepadContent: '', // notepad的内容
            currentUsername: '未登录',  //用户名，传给子组件Explorer
            client: client,
            changeFlag: 0
        };
    },
    mounted() {
        // 开始连接客户端
        this.client.connect().then((v) => {
            if (!v.isSucc) {
                alert("= 连接失败 =\n" + v.errMsg);
            }
        });

        // 监听token过期消息
        let handler = this.client.listenMsg('user/Expire', msg => {
            console.log(msg);
            alert("Token expired, please login again.");
            // 退出登录
            this.$refs.headPortrait.handleLogout();
            // 解除监听
            // this.client.unlistenMsg('user/Expire', handler);
        });

        // 处理服务端断开连接的情况, 可以向postDisconnectFlow中添加处理函数
        // 这些函数会在服务器断开连接后被调用
        this.client.flows.postDisconnectFlow.push((v) => {
            alert("Server disconnected");
            return v;
        });
    },
    methods: {
        // 切换到上一个标签页
        changeToLastKey() {
            // 这里先统一改为回到首页
            this.nowTabKey = '1';
            // TODO；这里是有问题的，因为继续回溯，直到没有上一个标签页为止，而且如果是最后一个标签页，这里应该设置为-1，然后判断
            // 目前解决方案是可以把第一个标签页定为首页，然后不能能被关闭
            this.lastTabKey = '1';

            // 加载当前标签的内容
            //this.componentChange("Notepad");
            this.content = sessionStorage.getItem(this.nowTabKey) ?? '';
            this.notepadContent = this.content;
        },
        changeKey(key) {
            this.lastTabKey = this.nowTabKey;
            this.nowTabKey = key;
            // console.log(this.tabKey);

            //获取type
            let type = sessionStorage.getItem(this.nowTabKey+'type');
            console.log("当前标签页类型：", type);

            // 更新标题
            this.sharedTitle = this.$refs.tabsRef.data.find(item => item.key == key).title;
            // console.log("标题：", this.sharedTitle);

            //根据不同的type来切换不同的组件
            if (type == "Notepad") {
                this.componentChange(type);
                // 加载当前标签的内容
                // console.log(sessionStorage.getItem(this.nowTabKey));
                this.content = sessionStorage.getItem(this.nowTabKey) ?? '';
                this.notepadContent = this.content;
                // console.log(this.notepadContent);
            } else if (type == "PDFViewer") {
                this.componentChange(type);
                // 切换pdf的base64
                //this.changePdfUrl(sessionStorage.getItem(this.nowTabKey) ?? '');
                //TOOD::后端和本地预览的source格式不一样导致冲突
                let source = 'data:application/pdf;base64,' + sessionStorage.getItem(this.nowTabKey) ?? ''
                this.changeFlag = Date.now();
                this.pdfSource = source;
                
                //this.pdfSource = source;
            } else if (type == "CodeMirror") {
                this.componentChange(type);
            }

      
    },
    // 组件动态切换，将SideMenu组件中传递的组件名传入App组件的CurrentComponent中
    // 对SideMenu传进来的key进行判断，如果是Explorer或者Search则切换Sider的组件，否则切换Content的组件
    componentChange(key){
      console.log(key);
      if (key == 'Explorer') {
        this.CurrentComponentSider = key;

      } else if (key == 'Search') {
        this.CurrentComponentSider = key;
      } else if (key == 'PDFLoader') {
        this.CurrentComponentSider = key;
      }
      else {
        this.CurrentComponentContent = key;
      }
    },
    handleFileSelected(title, content, type) {  
        client.logger.info('File title and content:', title, content);
        console.log(type);
        if(type == 'pdf') {
            this.$refs.tabsRef.handleAdd(title,content,"PDFViewer");
        } else {
            this.$refs.tabsRef.handleAdd(title,content,"Notepad");
        }
    },
    pdfView(fileName, pdfBase64) {
        //添加一个新的tab来展示pdf
        console.log("pdfView start");
        this.$refs.tabsRef.handleAdd(fileName, pdfBase64, "PDFViewer");
        //this.$refs.PDFViewer.changePdfUrl(pdfBase64);
    },
    handleLoginSuccess(username){
        this.currentUsername = username;
        console.log("当前用户是" + this.currentUsername);
    }
  },
};
</script>
