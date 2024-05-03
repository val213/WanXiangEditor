<template>
  <a-layout>
    <div id="app" style="display: flex; flex-direction: column; height: 100vh;" class="WorkBench">
      <a-layout-header>
        <a-space :size="970" direction="horizontal" fill align="center">
          <Menu />
          <HeadPortrait ref="headPortrait" />
        </a-space>
      </a-layout-header>
      <a-layout>
            <a-layout-sider :width="120">
              <SideMenu :CurrentItem="CurrentComponent" @componentChange="componentChange"/>
            </a-layout-sider>
            <a-layout-sider :resize-directions="['right']" :style="{maxWidth: '80%', textAlign: 'center' }">
              <KeepAlive>
                <component :is="CurrentComponentSider" :tabKey="tabKey"></component>
              </KeepAlive>
            </a-layout-sider>
            <a-layout-content>
              <Tabs :tabs="tabs" @tab-click="changeKey" />
              <KeepAlive>
                <component :is="CurrentComponentContent" :tabKey="tabKey"></component>
              </KeepAlive>
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
import Editor from './components/BasicEditor.vue';
import Menu from './components/Menu.vue';
import SideMenu from './components/SideMenu.vue';
import Search from './components/Search.vue';
import HeadPortrait from './components/HeadPortrait.vue';
import Notepad from './components/Notepad.vue';
import { client } from './client';

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
  },
  data() {
    return {
      // other data...
      CurrentComponentContent: 'Notepad',
      CurrentComponentSider: 'Explorer',
      tabKey: '',
      client: client,
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
    changeKey(key) {
      this.tabKey = key;
      console.log(this.tabKey);
    },
    // 组件动态切换，将SideMenu组件中传递的组件名传入App组件的CurrentComponent中
    // 对SideMenu传进来的key进行判断，如果是Explorer或者Search则切换Sider的组件，否则切换Content的组件
    componentChange(key){
      console.log(key);
      if (key == 'Explorer') {
        this.CurrentComponentSider = key;
      } else if (key == 'Search') {
        this.CurrentComponentSider = key;
      }
      else {
        this.CurrentComponentContent = key;
      }
    },
  },
};
</script>

