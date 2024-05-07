/**
 * 存储在数据库的共享文件信息
 */

import { ObjectId } from "mongodb";

export interface DbSharedTxt {
    _id: ObjectId,
    filename: string, // 文件名
    content: string, // 文件内容

}