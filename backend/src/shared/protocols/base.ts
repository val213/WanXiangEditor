export interface BaseRequest {
    __ssoToken?: string;
}

export interface BaseResponse {
    // Init or refresh sso token
    __ssoToken?: string;
}

export interface BaseConf {
    needLogin?: boolean,
    needRoles?: string[]
}

declare module 'tsrpc' {
    export interface BaseConnection {
        // 自定义的新字段
        userId: number;
    }
}