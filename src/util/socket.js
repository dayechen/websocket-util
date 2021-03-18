export default class {
  socketTask = null // socket实例
  messageID = 0 // 消息的唯一标识
  echoEvents = {} // 发送出去的各种消息
  events = {} // 被注册的各种事件
  url = ""
  constructor(url) {
    this.url = url
  }
  start = () => {
    this.socketTask = new WebSocket(this.url)
    this.socketTask.onmessage = (e) => {
      const { code, messageID, content, event } = JSON.parse(e.data)
      if (event === 'echo') {
        const eventFunc = this.echoEvents[messageID]
        if (!eventFunc) return
        eventFunc[code === 0 ? 'resolve' : 'reject'](content)
        return
      }

      const eventFunc = this.events[event]
      if (eventFunc) {
        eventFunc(content)
      }
      // 收到消息调用方法
    }
    this.socketTask.onerror = e => {
      console.log("socket连接错误", e)
    }
    this.socketTask.onclose = e => {
      console.log("连接被关闭", e)
      if(this.events["close"]){
        this.events["close"](e)
      }
    }
  }
  echoMessage = (data) => {
    this.messageID++ // 自增长确保id不会重复
    data.messageID = this.messageID
    // console.log("发送的数据", data)
    this.socketTask.send(JSON.stringify(data))

    return new Promise((resolve, reject) => {
      this.echoEvents[this.messageID] = { resolve, reject }
    })
  }
  sendMessage = (data) => {
    this.messageID++ // 自增长确保id不会重复
    data.messageID = this.messageID
    // console.log("发送的数据", data)
    this.socketTask.send(JSON.stringify(data))
  }
  on(name, callback) {
    this.events[name] = callback
  }
  close(){
    this.socketTask.close()
  }
}