import { DbUser } from "../../collectionType/DbUser";
import { BaseRequest, BaseResponse } from "../base";

export interface ReqUpdateUser {
    update: Partial<Pick<DbUser, 'username' | 'password' | 'introduction'>>;
}

export interface ResUpdateUser {
    matchedCount: number;
}

//Pick<DbUser, '_id'> & 