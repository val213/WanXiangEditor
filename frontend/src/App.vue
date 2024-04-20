<template>
  <a-layout>
    <div id="app" style="display: flex; flex-direction: column; height: 100vh;" class="WorkBench">
      <a-layout-header>
        <Menu />
      </a-layout-header>
      <a-layout>
            <a-layout-sider :resize-directions="['right']">
              <Tree :treeData="treeData" />
            </a-layout-sider>
            <a-layout-content>
              <Tabs :tabs="tabs" />
              <BasicEditor />
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
import BasicEditor from './components/BasicEditor.vue';
import Menu from './components/Menu.vue';

export default {
  name: 'App',
  components: {
    Statusbar,
    Tabs,
    Tree,
    BasicEditor,
    Menu,
  },
  data() {
    return {
      treeData: [], // Define treeData here
      // other data...
    };
  },
};
</script>