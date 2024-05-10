import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqSaveFile extends BaseRequest {
    content: string;
    title: string;
    filepath: string;
}

export interface ResSaveFile extends BaseResponse {
    filePath: string;
}

export const conf: BaseConf = {
    
}