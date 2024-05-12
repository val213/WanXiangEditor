/**
 * 存储在数据库的用户信息
 */
import { ObjectId } from "mongodb";
const crypto = require('crypto');

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

// 生成当前时间戳的SHA-256哈希，根据注册的时间设置Uid
function generateHash() {
    const timeStamp = new Date().getTime().toString();
    const hash = crypto.createHash('sha256').update(timeStamp).digest('hex');
    return hash;
  }

// Uid范围：0-9999
function hashToUid(hash: string) {
    // 取哈希的前5个字符，并将其从16进制转换为10进制
    const decimalValue = parseInt(hash.substring(0, 5), 16);
    return decimalValue % 1000;
  }



  // 验证UID的唯一性。
function isUidUnique(uid: string): boolean {
    // 这里应该连接数据库查询UID是否唯一，这里暂时使用Set模拟
    //return !existingUids.has(uid);
    return true;
  }
  
// 生成UID，使UID固定为四位数字
function generateNumericUid() {
    let uid = hashToUid(generateHash()).toString();
  
    // 不足四位的情况下补0
    while (uid.length < 4) {
      uid = '0' + uid;
    }
    return uid;
    while(!isUidUnique(uid)){
      uid = (parseInt(uid) + 1).toString().padStart(4, '0');//Hash冲突则uid+1
    }
    //这里应该要连接数据库，把生成的新Uid放入数据库中
    
    //这里写放入代码
  
    return uid;
  }