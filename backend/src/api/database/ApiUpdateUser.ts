import { ApiCall } from "tsrpc";
import { Global } from "../../models/Global";
import { ReqUpdateUser, ResUpdateUser } from "../../shared/protocols/database/PtlUpdateUser";
import { Db } from "mongodb";

/**
 * 用来修改用户信息的，暂时未有相关功能调用这个接口
 */
export async function ApiUpdateUser(call: ApiCall<ReqUpdateUser, ResUpdateUser>) {
    let { _id, ...rest } = call.req.update;

    let op = await Global.collection('User').updateOne({
        tomodifyusername: call.currentUser?.username
    }, {
        $set: {
            ...rest,
            update: {
                uid: 'xxx',
                time: new Date(),
            }
        }
    });

    call.succ({
        matchedCount: op.matchedCount
    })

}