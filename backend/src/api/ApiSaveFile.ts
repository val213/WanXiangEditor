import { ApiCall } from "tsrpc";
import { ReqSaveFile, ResSaveFile } from "../shared/protocols/PtlSaveFile";
import { server } from "..";
import fs from 'fs/promises';
export default async function (call: ApiCall<ReqSaveFile, ResSaveFile>) {
    // 保存文件
    let title = call.req.title;
    let content = call.req.content;
    let filepath = call.req.filepath;
    await fs.writeFile(filepath, content);

    call.succ({
        filePath: 'http://127.0.0.1:3000/'+ filepath + title
    });
}