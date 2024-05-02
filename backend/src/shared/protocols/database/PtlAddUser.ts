import { DbUser } from "../../collectionType/DbUser";

export interface ReqAddUser {
    newUser: Omit<DbUser, '_id' | 'uid' | 'create' | 'update'>;
}

export interface ResAddUser {
    insertedId: string;
}