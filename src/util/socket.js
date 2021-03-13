let socketTask = null // socket实例
let messageID = 0

const startSocket = () => {
  socketTask = new WebSocket("ws://192.168.1.9:3000/ws")
  socketTask.onmessage = (e) => {
    const res = JSON.parse(e.data)
    console.log("收到socket消息", res)
    // 收到消息调用方法
  }
}

const sendMessage = (data) => {
  messageID++ // 自增长确保id不会重复
  data.messageID = messageID
  console.log("发送的数据",data)
  socketTask.send(JSON.stringify(data))
}
export { startSocket, sendMessage }