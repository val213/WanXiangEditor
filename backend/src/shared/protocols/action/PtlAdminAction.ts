// 暂时没有使用的场景

import { BaseRequest, BaseResponse, BaseConf } from '../base'

export interface ReqAdminAction extends BaseRequest {

}

export interface ResAdminAction extends BaseResponse {
    result: string
}

export const conf: BaseConf = {
    needLogin: true,
    needRoles: ['Admin']
};