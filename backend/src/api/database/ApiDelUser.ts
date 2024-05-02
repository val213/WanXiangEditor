import { ApiCall } from "tsrpc";
import { Global } from "../../models/Global";
import { ReqDelUser, ResDelUser } from "../../shared/protocols/database/PtlDelUser";

/**
 * 用于用户注销自己的账号，目前暂未有相关的功能调用这个接口
 */
export async function ApiDelUser(call: ApiCall<ReqDelUser, ResDelUser>) {
    await Global.collection('User').deleteOne({
        _id: call.req._id
    })

    call.succ({});
}