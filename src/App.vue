<template>
  <div class="box">
    <div class="socket-box" v-for="(item,index) in testData.slice(0,19)" :key="index">
      <div v-if="index !== 0">
        <div>用户{{index}}</div>
        <div class="content">
          <div v-if="message[index]">
            <div v-for="(item1,index1) in message[index]" :key="index1" class="item">{{item1}}</div>
          </div>
        </div>
        <div>
          <input type="number" v-model.number="chessPos.x" />
          <input type="number" v-model.number="chessPos.y" />
          <input type="number" v-model.number="chessPos.level" />
        </div>
        <div class="buttons">
          <button @click="startSocket(index)">打开连接</button>
          <button @click="closeSocket(index)">关闭连接</button>
          <button @click="match(index)">开始匹配</button>
          <button @click="placeChess(index)">出牌</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "./util/socket.js";
export default {
  created() {
    for (let i = 1; i <= 100; i++) {
      this.testData.push(i);
    }
    this.testData.map((_, i) => {
      this.initSocket(i);
    });
  },
  data() {
    return {
      goodsID: 0,
      socket: null,
      socketList: [],
      chessPos: {
        x: 0,
        y: 0,
        level: 1,
      },
      testData: [],
      message: [], // socket收到的消息
      eventName: [
        "test",
        "start",
        "match",
        "hurt",
        "gameOver",
        "welcome",
        "close",
      ],
    };
  },
  methods: {
    match(i) {
      this.socketList[i]
        .echoMessage({
          event: "match",
        })
        .then((res) => {
          this.pushMsg(i, res);
        })
        .catch((res) => {
          this.pushMsg(i, res);
        });
    },
    placeChess(i) {
      console.log(i);
      this.socketList[i]
        .echoMessage({
          event: "placeChess",
          params: {
            x: this.chessPos.x,
            y: this.chessPos.y,
            level: this.chessPos.level,
          },
        })
        .then((res) => {
          this.pushMsg(i, res);
        })
        .catch((res) => {
          this.pushMsg(i, res);
        });
    },
    closeSocket(i) {
      this.socketList[i].close();
      this.pushMsg(i, "连接关闭");
    },
    startSocket(i) {
      this.socketList[i].start();
    },
    query(variable) {
      const query = window.location.search.substring(1);
      const vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    pushMsg(i, msg) {
      msg = JSON.stringify(msg);
      if (!this.message[i]) {
        this.message[i] = [msg];
      } else {
        this.message[i].push(msg);
      }
    },
    initSocket(i) {
      this.socketList[i] = new socket("ws://192.168.2.107:3000/ws?token=" + i);

      this.eventName.forEach((x) => {
        this.socketList[i].on(x, (res) => {
          this.pushMsg(i, res);
        });
      });

      this.socketList[i].start();
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
div {
  box-sizing: border-box;
}
.socket-box {
  display: inline-block;
  border: solid black 1px;
  margin-right: 5px;
  margin-top: 5px;
}
.content {
  height: 400px;
  width: 460px;
  overflow: scroll;
  /* background: red; */
}
.box {
  vertical-align: middle;
}
.buttons {
  width: 440PX;
}
.buttons > button {
  display: inline-block;
}
.item {
  padding: 5px;
  width: 440px;
  word-break: break-all;
  word-wrap: break-word;
  /* overflow: hidden; */
}
.item:nth-child(odd) {
  background-color: rgb(238, 238, 238);
}
</style>
