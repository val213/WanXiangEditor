import { ApiCall } from "tsrpc";
import { ReqGetFileList, ResGetFileList } from "../shared/protocols/PtlGetFileList";
import * as fs from 'fs';
import * as path from 'path';

export default async function (call: ApiCall<ReqGetFileList, ResGetFileList>) {
    const uploadsDirectory = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDirectory, (err, files) => {
        if (err) {
            call.error('Error reading uploads directory');
        } else {
            call.succ({ fileList: files });
        }
    });
}