import { ApiCall } from "tsrpc";
import { Global } from '../../models/Global';
import { ReqGetUser, ResGetUser } from '../../shared/protocols/database/PtlGetUser';

/**
 * 根据用户名在数据库中查询并获得用户信息
 */
export async function ApiGetUser(call: ApiCall<ReqGetUser, ResGetUser>) {
    let op = await Global.collection('User').findOne({
        username: call.req.username
    });

    if (!op) {
        call.error('用户不存在');
        return;
    }

    if (!op.introduction) {
        op.introduction = '请输入您的简介';
    }

    call.succ({
        user: {
            ...op,
        }
    })
}