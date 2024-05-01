import * as path from "path";
import { WsServer } from "tsrpc";
import { serviceProto } from './shared/protocols/serviceProto';
import { Global } from "./models/Global";

// Create the Server
export const server = new WsServer(serviceProto, {
    port: 3000,
    // Remove this to use binary mode (remove from the client too)
    json: true
});

// 初始化启动前的服务
async function init() {
    // 自动实现API
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // 初始化全局变量
    await Global.init(server.logger);
};

// 入口函数
async function main() {
    await init();
    await server.start();
}

// 运行入口函数并进行错误处理
main().catch(error => {
    server.logger.error(error);
    process.exit(-1);
});