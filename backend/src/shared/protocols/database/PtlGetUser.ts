import { DbUser } from "../../collectionType/DbUser";

export interface ReqGetUser {
    username: string;
}

export interface ResGetUser {
    user: DbUser;
}
