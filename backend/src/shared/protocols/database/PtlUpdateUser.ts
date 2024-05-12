import { DbUser } from "../../collectionType/DbUser";
import { BaseRequest, BaseResponse } from "../base";

export interface ReqUpdateUser {
    update: Pick<DbUser, '_id'> & Partial<Pick<DbUser, 'username' | 'password' | 'introduction'>>;
}

export interface ResUpdateUser {
    matchedCount: number;
}

//Pick<DbUser, '_id'> & 