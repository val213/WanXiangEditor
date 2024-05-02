import { ApiCall } from "tsrpc";
import { UserUtil } from "../../models/UserUtil";
import { ReqLogin, ResLogin } from "../../shared/protocols/user/PtlLogin";

export async function ApiLogin(call: ApiCall<ReqLogin, ResLogin>) {
    // 查找是否存在用户
    let user = UserUtil.users.find(v => v.username === call.req.username && v.password === call.req.password);
    
    if (!user) {
        call.error('用户名/密码错误！');
        return;
    }

    let sso = await UserUtil.createSsoToken(user.uid);

    call.succ({
        __ssoToken: sso,
        user: user
    })
}