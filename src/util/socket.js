let socketTask = null // socket实例
let messageID = 0

const events = {} // 发送出去的各种消息

const startSocket = () => {
  socketTask = new WebSocket("ws://192.168.1.9:3000/ws?token=998")
  socketTask.onmessage = (e) => {
    const { code, messageID, content } = JSON.parse(e.data)
    const event = events[messageID]
    if (!event) { return }
    if (code === 0) {
      event.resolve(content)
    } else {
      event.reject(content)
    }
    // 收到消息调用方法
  }
  socketTask.onerror = (e) => {
    console.log("socket连接错误", e)
  }
  socketTask.onclose = (e) => {
    console.log("连接被关闭", e)
  }
}
const sendMessage = (data) => {
  messageID++ // 自增长确保id不会重复
  data.messageID = messageID
  console.log("发送的数据", data)
  socketTask.send(JSON.stringify(data))

  return new Promise((resolve, reject) => {
    events[messageID] = { resolve, reject }
  })
}

export { startSocket, sendMessage }