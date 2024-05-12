import { Binary } from "mongodb";
import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqSelectFile extends BaseRequest {
    selectedTitle: string;
    filePath?: string;
    fileType?: string;
}

export interface ResSelectFile extends BaseResponse {
    fileType?: string;
    content?: string;
    path?: string;
}

export const conf: BaseConf = {

}