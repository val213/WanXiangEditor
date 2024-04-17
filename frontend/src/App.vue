<template>
  <div id="app">
    <p>Vue3 wangEditor demo</p>
    <BasicEditor></BasicEditor>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import BasicEditor from './components/BasicEditor.vue';
import Chatroom from './components/Chatroom.vue';
export default {
  name: 'App',
  components: {
    // HelloWorld
    BasicEditor,
    //Chatroom,
  },
};
</script>

<style></style>
