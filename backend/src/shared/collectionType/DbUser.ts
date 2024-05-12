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
export function generateUid(): number {
    return Math.floor(Math.random() * 1000000);
}

function generateHash() {
    const timeStamp = new Date().getTime().toString();
    const hash = crypto.createHash('sha256').update(timeStamp).digest('hex');
    return hash;
  }

function hashToUid(hash: string) {
    const decimalValue = parseInt(hash.substring(0, 5), 16);
    return decimalValue % 1000;
  }



function isUidUnique(uid: string): boolean {
    //return !existingUids.has(uid);
    return true;
  }
  
function generateNumericUid() {
    let uid = hashToUid(generateHash()).toString();
  
    while (uid.length < 4) {
      uid = '0' + uid;
    }
    return uid;
    while(!isUidUnique(uid)){
      uid = (parseInt(uid) + 1).toString().padStart(4, '0');//Hash��ͻ��uid+1
    }

  
    return uid;
}
  