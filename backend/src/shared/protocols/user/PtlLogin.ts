import { CurrentUser } from '../../models/CurrentUser';
import { BaseConf, BaseRequest, BaseResponse } from '../base';

/**
 * 请求信息：
 * - username: 用户名
 * - password: 密码
 */
export interface ReqLogin extends BaseRequest {
    username: string,
    password: string
}

/**
 * 响应信息：
 * - __ssoToken: 身份验证凭据
 * - user: 当前用户信息
 */
export interface ResLogin extends BaseResponse {
    __ssoToken: string;
    user: CurrentUser;
}

export const conf: BaseConf = {

};