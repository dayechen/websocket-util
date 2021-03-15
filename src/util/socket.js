export default class {
  socketTask = null // socket实例
  messageID = 0 // 消息的唯一标识
  echoEvents = {} // 发送出去的各种消息
  events = {} // 被注册的各种事件
  startSocket = () => {
    this.socketTask = new WebSocket("ws://192.168.2.107:3000/ws?token=998")
    this.socketTask.onmessage = (e) => {
      const { code, messageID, content, event } = JSON.parse(e.data)
      if (event === 'echo') {
        const event = this.echoEvents[messageID]
        if (!event) return
        event[code === 0 ? 'resolve' : 'reject'](content)
        return
      }
      try {
        this.events[event](content)
      } catch {
        console.error("收到事件", event, '但未定义处理方法')
      }
      // 收到消息调用方法
    }
    this.socketTask.onerror = (e) => {
      console.log("socket连接错误", e)
    }
    this.socketTask.onclose = (e) => {
      console.log("连接被关闭", e)
    }
  }
  echoMessage = (data) => {
    this.messageID++ // 自增长确保id不会重复
    data.messageID = this.messageID
    console.log("发送的数据", data)
    this.socketTask.send(JSON.stringify(data))

    return new Promise((resolve, reject) => {
      this.echoEvents[this.messageID] = { resolve, reject }
    })
  }
  sendMessage = (data) => {
    this.messageID++ // 自增长确保id不会重复
    data.messageID = this.messageID
    console.log("发送的数据", data)
    this.socketTask.send(JSON.stringify(data))
  }
  on(name, callback) {
    this.events[name] = callback
  }
}