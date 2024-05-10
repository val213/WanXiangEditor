import * as uuid from "uuid";
import { CurrentUser } from "../shared/models/CurrentUser";

// 86400000 * 7 一星期
const SSO_VALID_TIME = 86400000; // 一天

export class UserUtil {
    static isTokenExpired(token: string) {
        let info = this.ssoTokenInfo[token];
        return !info || info.expiredTime < Date.now();
    }

    // 这里存储了用户的信息，后面要从数据库获取用户信息
    static users: {
        uid: number,
        username: string,
        password: string,
        roles: string[]
    }[] = [
            {
                uid: 1,
                username: 'Normal',
                password: '123456',
                roles: ['Normal']
            },
            {
                uid: 2,
                username: 'Admin',
                password: '123456',
                roles: ['Admin']
            }
        ];

    // sso token的信息, 这个ssoTokenInfo应该是个Hash映射
    // uid：用户的唯一标识符
    // expiredTime：过期时间
    static ssoTokenInfo: {
        [token: string]: { uid: number, expiredTime: number, }
    } = {};

    // 生成一个sso token
    static async createSsoToken(uid: number): Promise<string> {
        let token = uuid.v1();
        // 计算sso token过期时间
        let expiredTime = Date.now() + SSO_VALID_TIME;

        this.ssoTokenInfo[token] = {
            uid: uid,
            expiredTime: expiredTime
        };

        return token;
    }

    // 销毁一个sso token
    static async destroySsoToken(ssoToken: string): Promise<void> {
        delete this.ssoTokenInfo[ssoToken];
    }

    // 解析一个sso token
    static async parseSSO(ssoToken: string): Promise<CurrentUser | undefined> {
        let info = this.ssoTokenInfo[ssoToken];

        // sso token不存在或已经过期了
        if (!info || info.expiredTime < Date.now()) {
            return undefined;
        }

        // 没有找到匹配的用户
        let user = this.users.find(v => v.uid === info.uid);
        if (!user) {
            return undefined;
        }

        // 每次解析sso都会延长其过期时间
        info.expiredTime = Date.now() + SSO_VALID_TIME;

        // 返回当前用户
        return {
            uid: user.uid,
            username: user.username,
            roles: user.roles,
        }
    }
}