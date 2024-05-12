import { ApiCall } from "tsrpc";
import { ReqCreateSharedDoc, ResCreateSharedDoc } from "../../shared/protocols/SharedDoc/PtlCreateSharedDoc";
import { getYDoc, messageListener, setupWSConnection} from '../../models/SharedDoc/WSSharedDoc';
import { server } from "../..";


export default async function (call: ApiCall<ReqCreateSharedDoc, ResCreateSharedDoc>) {
	console.log('调用API时连接状态: ', call.conn.status);

    call.conn.dataType = 'buffer';

    const doc = getYDoc(call.req.docName, call.req.gc);
    doc.conns.set(call.conn, new Set());
    // 注册监听事件
    server.listenMsg('SharedDoc/UpdateDoc', call => {
        console.log('收到更新消息: ', call.msg);
        messageListener(call.conn, doc, call.msg.updatedDoc);
    });

    // 在连接建立时，首先发送同步消息的第一步，并向连接发送文档对象的awareness状态更新消息
    setupWSConnection(doc, call.conn);

    call.succ({});
}