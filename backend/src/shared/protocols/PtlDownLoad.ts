import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqDownLoad extends BaseRequest {
    filePath: string;
}

export interface ResDownLoad extends BaseResponse {
    content: string;
    fileType: string;
}

export const conf: BaseConf = {

}