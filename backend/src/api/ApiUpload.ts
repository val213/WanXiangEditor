import fs from "fs/promises";
import { ApiCall } from "tsrpc";
import { ReqUpload, ResUpload } from "../shared/protocols/PtlUpload";

export async function ApiUpload(call: ApiCall<ReqUpload, ResUpload>) {
    // Write to file, or push to remote OSS...
    // 这里需要写实际的保存路径，在本地测试，加上/是绝对路径，不加是相对路径
    // 注意，需要先创建 uploads 文件夹（已创建）
    await fs.writeFile('uploads/' + call.req.fileName, call.req.fileData);

    call.succ({
        url: 'http://127.0.0.1:3000/uploads' + call.req.fileName
    });
}