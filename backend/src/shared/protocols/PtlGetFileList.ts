import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqGetFileList extends BaseRequest {
    
}

export interface ResGetFileList extends BaseResponse {
    fileList: string[];
}

export const conf: BaseConf = {
    
}