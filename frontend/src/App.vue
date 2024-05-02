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
              <Tree />
            </a-layout-sider>
            <a-layout-content>
              <Tabs :tabs="tabs" @tab-click="changeKey" />
              <KeepAlive>
                <component :is="CurrentComponent" :tabKey="tabKey"></component>
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
import Tree from './components/Tree.vue';
import Editor from './components/BasicEditor.vue';
import Menu from './components/Menu.vue';
import SideMenu from './components/SideMenu.vue';
export default {
  name: 'App',
  components: {
    Statusbar,
    Tabs,
    Tree,
    Editor,
    Menu,
    SideMenu,
  },
  data() {
    return {
      // other data...
      CurrentComponent: 'Editor',
      tabKey: '',
    };
  },
  methods: {
    changeKey(key) {
      this.tabKey = key;
      console.log(this.tabKey);
    },
    //组件动态切换，将SideMenu组件中传递的组件名传入App组件的CurrentComponent中
    componentChange(key){
      console.log(key);
      this.CurrentComponent = key;
    },
  },
};
</script>