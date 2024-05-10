import { ApiCall } from "tsrpc";
import { Global } from "../../models/Global";
import { ReqAddUser, ResAddUser } from "../../shared/protocols/database/PtlAddUser";
import { generateUid } from "../../shared/collectionType/DbUser";

/**
 * 用来添加用户信息到数据库
 */
export async function ApiAddUser(call: ApiCall<ReqAddUser, ResAddUser>) {
    let op = await Global.collection('User').insertOne({
        ...call.req.newUser,
        uid: generateUid(),
        // introduction: '',
        create: {
            uid: 'xxx',
            time: new Date()
        },
    });

    call.succ({
        insertedId: op.insertedId.toHexString()
    })
}