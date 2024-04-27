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
            <a-layout-sider :resize-directions="['right']">
              <Tree :treeData="treeData" />
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
import PDF from './components/Pdf.vue';

export default {
  name: 'App',
  components: {
    Statusbar,
    Tabs,
    Tree,
    Editor,
    Menu,
    SideMenu,
    PDF
  },
  data() {
    return {
      treeData: [], // Define treeData here
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
    componentChange(key){
      console.log(key);
      this.CurrentComponent = key;
    },
  },
};
</script>