<template>
  <div class="App">
    <h1>TSRPC Chatroom</h1>

    <div>
      <Chatroom title="Client #1" />
      <Chatroom title="Client #2" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chatroom from "./Chatroom.vue";

export default defineComponent({
  name: "App",
  components: {
    Chatroom,
  },
});
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.App {
  > h1 {
    text-align: center;
    margin-top: 20px;
  }

  > div {
    display: flex;
    justify-content: center;
  }
}
</style>
