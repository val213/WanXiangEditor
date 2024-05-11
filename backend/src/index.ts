import * as path from "path";
import { WsClient, WsConnection, WsServer } from "tsrpc";
import { serviceProto } from './shared/protocols/serviceProto';
import { Global } from "./models/Global";
import { parseCurrentUser } from "./models/parseCurrentUser";
import { enableAuthentication } from "./models/enableAuthentication";
import { UserUtil } from "./models/UserUtil";
import { error, time } from "console";
// Create the Server
export const server = new WsServer(serviceProto, {
    port: 3000,
    // Remove this to use binary mode (remove from the client too)
    json: true
});

// 初始化启动前的服务
async function init() {
    // 解析当前用户
    parseCurrentUser(server);
    
    // 启用身份验证
    enableAuthentication(server);  

    // 自动实现API
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // 初始化全局变量
    await Global.init(server.logger);
};


// 入口函数
async function main() {
    await init();
    await server.start();

    // 在服务器启动后定义定时器
    server.logger.log('Timer started');
    setInterval(() => {
        for (let token in UserUtil.ssoTokenInfo) {
            // server.logger.log(UserUtil.ssoTokenInfo);
            
            // server.logger.log(`Token ${token} 还有 ${UserUtil.ssoTokenInfo[token].expiredTime - Date.now()} ms 过期`);
            if (UserUtil.isTokenExpired(token)) {
                let conn = server.connections.find(v=>v.userId === UserUtil.ssoTokenInfo[token].uid);
                if(conn){
                    conn.sendMsg('user/Expire',{
                        content:'Token已过期，请重新登录'} );
                }
                // 销毁sso token
                UserUtil.destroySsoToken(token);
                server.logger.log(`Token ${token} 已过期, 销毁`);
            }
        }
    }, 1 * 1000);
}

// 运行入口函数并进行错误处理
main().catch(error => {
    server.logger.error(error);
    process.exit(-1);
});

function alert(arg0: string) {
    throw new Error("Function not implemented.");
}

