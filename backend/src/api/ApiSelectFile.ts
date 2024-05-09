import { ApiCall } from "tsrpc";
import { ReqSelectFile, ResSelectFile } from "../shared/protocols/PtlSelectFile";
import fs from 'fs';
import path from 'path';

export default async function (call: ApiCall<ReqSelectFile, ResSelectFile>) {
    // 解析参数得到文件路径
    let selectedTitle = call.req.selectedTitle;
    let filePath = `./${call.req.filePath}`;
    let fileType = call.req.fileType;
    call.logger.log(`检查请求的文件路径filepath：${call.req.filePath}`);
    // 返回文件内容
    try {
        // 读取文件内容(判断是文本文件还是二进制文件)
        console.log("type: "+fileType)
        if(fileType == "txt") {
            console.log("按string编码");
            let fileContent = fs.readFileSync(filePath, 'utf8');    
            // 返回文件内容
            call.succ({ content: fileContent ,fileType: path.extname(filePath)});
        }else if(fileType == "pdf") {
            console.log("按base64编码");
            console.log(filePath);
            let fileContent = fs.readFileSync(filePath);
            let base64FileContent = fileContent.toString('base64');
            // 返回文件内容
            call.succ({ content: base64FileContent ,fileType: path.extname(filePath)});
        }
    } catch (err) {
        // 如果读取文件失败，返回错误信息
        call.error((err as Error).message);
    }
}