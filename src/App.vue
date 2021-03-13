<template>
  <div>
    <input type="number" v-model.number="goodsID" />
    <button @click="sendOfferMessage">发送消息</button>
  </div>
</template>

<script lang="js">
import { defineComponent } from "vue";
import { sendMessage, startSocket } from "./util/socket.js";

export default{
  created() {
    startSocket();
  },
  data() {
    return {
      goodsID: 0,
    };
  },
  methods: {
    sendOfferMessage(){
      sendMessage({
        event:"test"
      })
    },
  },
}

// export default defineComponent({
//   name: "App",

// });
</script>

<style>
</style>
