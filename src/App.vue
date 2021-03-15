<template>
  <div>
    <input type="number" v-model.number="goodsID" />
    <button @click="sendOfferMessage">发送消息</button>
  </div>
</template>

<script lang="js">
import { defineComponent } from "vue";
import socket from "./util/socket.js";

export default{
  created() {
    this.socket = new socket()
    this.socket.startSocket()
    this.socket.on("test",res=>{
      console.log("收到消息",res)
    })
  },
  data() {
    return {
      goodsID: 0,
      socket:null
    };
  },
  methods: {
    sendOfferMessage(){
     this.socket.sendMessage({
        event:"test",
        params:{
          "name":"cao"
        }
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
