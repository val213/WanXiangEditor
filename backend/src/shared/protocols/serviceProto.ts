import { ServiceProto } from 'tsrpc-proto';


export interface ServiceType {
    api: {

    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 3,
    "services": [],
    "types": {}
};