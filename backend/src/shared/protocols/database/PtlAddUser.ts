import { DbUser } from "../../collectionType/DbUser";

export interface ReqAddUser {
    newUser: Pick<DbUser, 'username' | 'password'>;
}

export interface ResAddUser {
    insertedId: string;
}