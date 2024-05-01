import { ApiCall } from "tsrpc";
import { ReqSetCookie, ResSetCookie } from "../shared/protocols/PtlSetCookie";

export default async function (call: ApiCall<ReqSetCookie, ResSetCookie>) {
    // TODO
    call.error('API Not Implemented');
}