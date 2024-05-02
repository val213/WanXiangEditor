import { WsServer } from "tsrpc";
import { BaseRequest } from "../shared/protocols/base";
import { CurrentUser } from "../shared/models/CurrentUser";
import { UserUtil } from "./UserUtil";

/**
 * 解析当前用户
 */
export function parseCurrentUser(server: WsServer) {
    // 在执行API接口实现之前解析当前用户
    server.flows.preApiCallFlow.push(async call => {
        let req = call.req as BaseRequest;
        if (req.__ssoToken) {
            call.currentUser = await UserUtil.parseSSO(req.__ssoToken);
        }
        return call;
    })
}

declare module 'tsrpc' {
    export interface ApiCall {
        currentUser?: CurrentUser;
    }
}