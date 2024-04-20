<template>
  <div id="app" style="display: flex; flex-direction: column; height: 100vh;">
    <Menu />
    <div style="display: flex; flex-grow: 1;">
      <div style="width: 20%; overflow: auto;">
        <Tree :treeData="treeData" />
      </div>
      <div style="width: 80%;">
        <Tabs :tabs="tabs" />
        <BasicEditor />
      </div>
    </div>
    <Statusbar />
  </div>
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
};
</script>