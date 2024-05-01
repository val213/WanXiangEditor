/**
 * 目前只作为示例
 */
import { ObjectId } from "mongodb";

export interface DbEditor {
    _id: ObjectId;
    title: string;
    content: string;
    visitedNum: number;

    create: {
        uid: string;
        time: Date;
    }

    update?: {
        uid: string,
        time: Date,
    }
}