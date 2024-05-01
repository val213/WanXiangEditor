import { ApiCall } from "tsrpc";
import { ReqSetSession, ResSetSession } from "../shared/protocols/PtlSetSession";

export default async function (call: ApiCall<ReqSetSession, ResSetSession>) {
    // TODO
    call.error('API Not Implemented');
}