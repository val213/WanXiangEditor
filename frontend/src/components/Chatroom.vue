<template>
  <div class="Chatroom">
    <header>{{ title }}</header>
    <ul class="list" ref="ul">
      <li v-for="(v, i) in list" :key="i">
        <div class="content">{{ v.content }}</div>
        <div class="time">{{ v.time.toLocaleTimeString() }}</div>
      </li>
    </ul>
    <div class="send">
      <input
        placeholder="Say something..."
        v-model="input"
        @keypress.enter="send"
      />
      <button @click="send">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { getClient } from "../getClient";
import { defineComponent, nextTick } from "vue";
import { MsgChat } from "../shared/protocols/MsgChat";

export default defineComponent({
  name: "Chatroom",
  props: {
    title: String,
  },
  data() {
    return {
      input: "",
      list: [] as MsgChat[],
      client: getClient(),
    };
  },

  mounted(): void {
    // Connect at startup
    this.client.connect().then((v) => {
      if (!v.isSucc) {
        alert("= Client Connect Error =\n" + v.errMsg);
      }
    });

    // Listen Msg
    this.client.listenMsg("Chat", (v) => {
      this.list.push(v);

      // Scroll the list to the bottom
      nextTick(() => {
        const ul = this.$refs.ul as HTMLElement;
        ul.scrollTo(0, ul.scrollHeight);
      });
    });

    // When disconnected
    this.client.flows.postDisconnectFlow.push((v) => {
      alert("Server disconnected");
      return v;
    });
  },

  methods: {
    // Send input message
    async send(): Promise<void> {
      let ret = await this.client.callApi("Send", {
        content: this.input,
      });

      // Error
      if (!ret.isSucc) {
        alert(ret.err.message);
        return;
      }

      // Success
      this.input = "";
    },
  },
});
</script>

<style scoped lang="less">
.Chatroom {
  display: flex;
  flex-direction: column;
  width: 460px;
  height: 480px;
  margin: 20px;
  background: #f7f7f7;
  border: 1px solid #454545;
  border-radius: 5px;
  overflow: hidden;

  > header {
    background: #454545;
    color: white;
    text-align: center;
    padding: 10px;
  }

  > .send {
    flex: 0 0 40px;
    display: flex;
    border-top: 1px solid #454545;

    > * {
      border: none;
      outline: none;
      height: 100%;
      font-size: 16px;
    }

    > input {
      flex: 1;
      background: #fff;
      padding: 0 10px;
    }

    > button {
      flex: 0 0 100px;
      background: #215fa4;
      color: white;
      cursor: pointer;

      &:hover {
        background: #4b80bb;
      }
    }
  }

  > .list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    border-radius: 5px;
    padding: 10px;
    padding-bottom: 20px;
    background: #f2f2f2;

    > li {
      margin-bottom: 10px;
      padding: 10px;
      background: #fff;
      line-height: 1.5em;
      border-radius: 5px;

      > .content {
        font-size: 14px;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      > .time {
        font-size: 12px;
        color: #4b80bb;
        text-align: right;
      }

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
    }
  }
}
</style>
