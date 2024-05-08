import { ApiCall } from "tsrpc";
import { ReqDownLoad, ResDownLoad } from "../shared/protocols/PtlDownLoad";

export default async function (call: ApiCall<ReqDownLoad, ResDownLoad>) {
    // TODO
    call.error('API Not Implemented');
}