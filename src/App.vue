<template>
  <div>
    <input type="number" v-model.number="goodsID" />
    <button @click="sendOfferMessage">发送消息</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { sendMessage, startSocket } from "./util/socket";

export default defineComponent({
  name: "App",
  created() {
    startSocket();
  },
  data() {
    return {
      goodsID: 0,
    };
  },
  methods: {
    sendOfferMessage: async function () {
      try {
        const res = await sendMessage({
          path: "offer",
          params: {
            goodsID: this.goodsID,
          },
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
