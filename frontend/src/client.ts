import {  WsClient } from "tsrpc-browser";
import { serviceProto } from "./shared/protocols/serviceProto";
import { ResLogin } from "./shared/protocols/user/PtlLogin";
// import { WebsocketProvider } from "y-websocket";
// import * as Y from "yjs";
/** 
 * 创建一个全局客户端实例
 */
export const client = new WsClient(serviceProto, {
    // 这里要换成自己的ip地址
    server: 'ws://192.168.17.131:3000',
    logger: console,
    json: true,
});

// 设置一个请求发送前的处理流程。
// 在发送请求前，如果本地存储中有SSO_TOKEN，则将其添加到请求头中
client.flows.preCallApiFlow.push(v => {
    // 判断是否为登录请求，再执行分支中代码
    if (v.apiName == 'user/Login') { 
        const ssoToken = localStorage.getItem('SSO_TOKEN');
        if (ssoToken) {
            v.req.__ssoToken = ssoToken;
        }
    }
    return v;
})

// 如果服务器返回的是成功的响应，并且响应中包含__ssoToken
// 则将此值token存储到本地存储中，
// 如果服务器返回的错误代码是NEED_LOGIN，
// 则从本地存储中移除token，并且设置状态为false
client.flows.postApiReturnFlow.push(v => {
    if (v.return.isSucc) {
        const res = v.return.res as ResLogin;
        if (res.__ssoToken !== undefined) {
            localStorage.setItem('SSO_TOKEN', res.__ssoToken);
            localStorage.setItem('USERNAME', res.user.username);
        }
    }
    else if (v.return.err.code === 'NEED_LOGIN') {
        localStorage.removeItem('SSO_TOKEN');
    }
    return v;
});


/* 测试代码
const doc = new Y.Doc()
const wsProvider = new WebsocketProvider('ws://192.168.17.131:3000', 'Notepad', doc)

const statusHandler = (event: {status: string}) => {
    if (event.status === 'connected') {
        console.log('Y-Websocket 连接成功')
    }else {
        console.log("Y-Websocket 连接失败")
    }
    // 取消监听
    wsProvider.off('status', statusHandler);
};

// 监听连接状态
wsProvider.on('status', statusHandler);


// 数字数组产生一个和值
const yarray = doc.getArray<number>('count');

// 观察和值的改变
yarray.observe(event => {
  // 当数据更新时打印
  console.log('new sum: ' + yarray.toArray().reduce((a, b) => a + b, 0));
});

yarray.push([1])
yarray.push([1])
yarray.push([1])
yarray.push([1])
yarray.push([1])

const doc2 = new Y.Doc();

const yarray2 = doc2.getArray<number>('count');
doc.on('update', update => {
    Y.applyUpdate(doc2, update);
})
doc2.on('update', update => {
    Y.applyUpdate(doc, update);
})


yarray2.push([1])*/