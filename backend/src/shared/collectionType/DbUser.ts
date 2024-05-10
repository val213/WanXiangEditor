/**
 * 存储在数据库的用户信息
 */
import { ObjectId } from "mongodb";

export interface DbUser {
    _id: ObjectId;
    uid: number;
    username: string;
    password: string;
    introduction: string;
    // roles: string[];

    create: {
        uid: string;
        time: Date;
    }

    update?: {
        uid: string,
        time: Date,
    }
}

/**
 * 生成随机的uid
 */
export function generateUid(): number {
    return Math.floor(Math.random() * 1000000);
}