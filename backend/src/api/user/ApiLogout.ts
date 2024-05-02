import { ApiCall } from "tsrpc";
import { UserUtil } from "../../models/UserUtil";
import { ReqLogout, ResLogout } from "../../shared/protocols/user/PtlLogout";

export async function ApiLogout(call: ApiCall<ReqLogout, ResLogout>) {
    // 销毁sso token，如果存在
    call.req.__ssoToken && UserUtil.destroySsoToken(call.req.__ssoToken);
    call.succ({
        __ssoToken: ''
    });
}