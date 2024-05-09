import { ApiCall } from "tsrpc";
import { ReqDownLoad, ResDownLoad } from "../shared/protocols/PtlDownLoad";
import fs from 'fs';
import path from 'path';
export default async function (call: ApiCall<ReqDownLoad, ResDownLoad>) {
    let filePath = `./${call.req.filePath}`;
    call.logger.log(`检查请求的文件路径filepath：${call.req.filePath}`);
    // 返回文件内容
    try {
        // 读取文件内容
        let fileContent = fs.readFileSync(filePath, 'utf8');
        // 返回文件内容
        call.succ({ content: fileContent ,fileType: path.extname(filePath)});
    } catch (err) {
        // 如果读取文件失败，返回错误信息
        call.error((err as Error).message);
    }
}