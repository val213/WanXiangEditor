import { WsServer } from "tsrpc";
import { BaseConf } from "../shared/protocols/base";

/**
 * 启用身份验证，检测请求是否满足服务配置的登录和角色要求
 */
export function enableAuthentication(server: WsServer) {
    server.flows.preApiCallFlow.push(call => {
        let conf: BaseConf | undefined = call.service.conf;

        // 检查是否需要登录
        if (conf?.needLogin && !call.currentUser) {
            call.error('请先登录', { code: 'NEED_LOGIN' });
            return undefined;
        }

        // 检查是否有权限
        if (conf?.needRoles?.length && !call.currentUser?.roles.some(v => conf!.needRoles!.indexOf(v) > -1)) {
            call.error('没有权限', { code: 'NO_AUTHORITY' });
            return undefined;
        }

        return call;
    })
}