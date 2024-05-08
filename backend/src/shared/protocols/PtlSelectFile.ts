import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqSelectFile extends BaseRequest {
    selectedTitle: string;
}

export interface ResSelectFile extends BaseResponse {
    fileType?: string;
    content?: string;
    path?: string;
}

export const conf: BaseConf = {
    
}