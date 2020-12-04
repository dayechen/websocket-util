import { offerMessage } from './types'

const f: Map<string, (data: any) => void> = new Map()

// 出价消息
f.set('offer', (data: offerMessage) => {
    console.log("收到出价消息", data)
})
// 收到成交消息
f.set('deal', (data: any) => {
    console.log('成交消息', data)
})
export default f