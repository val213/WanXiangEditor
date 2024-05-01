import { ApiCall } from "tsrpc";
import { ReqClear, ResClear } from "../shared/protocols/PtlClear";

export default async function (call: ApiCall<ReqClear, ResClear>) {
    // TODO
    call.error('API Not Implemented');
}