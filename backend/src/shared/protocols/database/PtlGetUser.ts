import { DbUser } from "../../collectionType/DbUser";

export interface ReqGetUser {
    username: string;
    // introduction: string;
}

export interface ResGetUser {
    user: DbUser;
}
