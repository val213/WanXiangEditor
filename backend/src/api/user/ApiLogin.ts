import { ApiCall } from "tsrpc";
import { UserUtil } from "../../models/UserUtil";
import { ReqLogin, ResLogin } from "../../shared/protocols/user/PtlLogin";
import { CurrentUser } from "../../shared/models/CurrentUser";

export async function ApiLogin(call: ApiCall<ReqLogin, ResLogin>) {
    let sso = await UserUtil.createSsoToken(call.req.uid);
    let user: CurrentUser = {
        uid: call.req.uid,
        username: call.req.username,
        roles: [],
        introduction: call.req.introduction,
    };
    call.conn.userId = user.uid;
    call.succ({
        __ssoToken: sso,
        user: user
    })
}