<template>
  <a-layout>
    <div id="app" style="display: flex; flex-direction: column; height: 100vh;" class="WorkBench">
      <a-layout-header>
        <Menu />
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
export default {
  name: 'App',
  components: {
    Statusbar,
    Tabs,
    Explorer,
    Editor,
    Menu,
    SideMenu,
    Search,
  },
  data() {
    return {
      // other data...
      CurrentComponentContent: 'Editor',
      CurrentComponentSider: 'Explorer',
      tabKey: '',
    };
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