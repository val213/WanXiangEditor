import {  WsClient } from "tsrpc-browser";
import { serviceProto } from "./shared/protocols/serviceProto";
import { ResLogin } from "./shared/protocols/user/PtlLogin";

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