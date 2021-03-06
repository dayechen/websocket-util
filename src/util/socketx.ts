import methods from './methods'

let socketTask: WebSocket // socket实例
let messageID = 1 // 消息的唯一标识
// promise两个参数的类型
type messageRes = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}
// resType 接收到的参数类型
type resType = {
  code: number;
  cmd: string;
  message: string;
  type: string;
  messageID: number;
  data: any;
}

// sendMessageType 发送消息的类型
type sendMessageType = {
  event: string;
  params: any;
  messageID?: number;
}
// 消息列表
const messageMap: Map<number, messageRes> = new Map()

const startSocket = () => {
  socketTask = new WebSocket("ws://192.168.1.9:3000/ws")
  socketTask.onmessage = (e) => {
    const res: resType = JSON.parse(e.data)
    console.log("收到socket消息",res)
    // 收到消息调用方法
    try {
      const socketCmdFunc = methods.get(res.cmd) as (data: any) => void
      socketCmdFunc(res.data)
    } catch (e) {
      console.warn("收到命令", res.cmd, "但未定义处理方法")
    }

    switch (res.code) {
      case 0:
        // 发送成功
        if (res.messageID !== 0) {
          messageMap.get(res.messageID)?.resolve("卧槽成功了")
        }
        break
      case 1:
        // 无需处理的错误
        alert(res.message)
        break
      case 2:
        // 返回错误直接处理
        if (res.messageID !== 0) {
          messageMap.get(res.messageID)?.reject("失败了")
        }
        break
    }
    if (res.messageID !== 0) {
      messageMap.delete(res.messageID)
    }
  }
}

const sendMessage = (data: sendMessageType) => {
  messageID++ // 自增长确保id不会重复
  data.messageID = messageID
  socketTask.send(JSON.stringify(data))
  return new Promise((resolve, reject) => {
    messageMap.set(messageID, { resolve, reject })
  })
}

export { startSocket, sendMessage }