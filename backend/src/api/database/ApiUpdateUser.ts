import { ApiCall } from "tsrpc";
import { Global } from "../../models/Global";
import { ReqUpdateUser, ResUpdateUser } from "../../shared/protocols/database/PtlUpdateUser";
import { Db } from "mongodb";

/**
 * 用来修改用户信息的，暂时未有相关功能调用这个接口
 */
export async function ApiUpdateUser(call: ApiCall<ReqUpdateUser, ResUpdateUser>) {
    let { username, ...rest } = call.req.update;
    console.log('filter object:', call.req.update.username);  //测试用
    console.log('update object:', call.req.update);   //测试用
    let op = await Global.collection('User').updateOne({
        tomodifyusername: call.currentUser?.username
    }, {
        $set: {
            ...rest,
            update: {
                uid: 'xxx',
                time: new Date(),
                username: username,
                introduction: rest.introduction,
            }
        }
    });

    call.succ({
        matchedCount: op.matchedCount
    })

}