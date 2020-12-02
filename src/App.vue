<template>
  <div>陈大爷超级牛皮</div>
  <button @click="send">发送消息</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { sendMessage, startSocket } from "./util/socket";

export default defineComponent({
  name: "App",
  created() {
    startSocket();
  },
  methods: {
    send: async function () {
      try {
        const res = await sendMessage({
          path: "echo",
          params: "666",
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style>
</style>
