import { ServiceProto } from 'tsrpc-proto';
import { ReqAdminAction, ResAdminAction } from './action/PtlAdminAction';
import { ReqGuestAction, ResGuestAction } from './action/PtlGuestAction';
import { ReqNormalAction, ResNormalAction } from './action/PtlNormalAction';
import { ReqAddUser, ResAddUser } from './database/PtlAddUser';
import { ReqDelUser, ResDelUser } from './database/PtlDelUser';
import { ReqGetUser, ResGetUser } from './database/PtlGetUser';
import { ReqUpdateUser, ResUpdateUser } from './database/PtlUpdateUser';
import { ReqClear, ResClear } from './PtlClear';
import { ReqDownLoad, ResDownLoad } from './PtlDownLoad';
import { ReqGetFileList, ResGetFileList } from './PtlGetFileList';
import { ReqSaveFile, ResSaveFile } from './PtlSaveFile';
import { ReqSelectFile, ResSelectFile } from './PtlSelectFile';
import { ReqSetCookie, ResSetCookie } from './PtlSetCookie';
import { ReqSetSession, ResSetSession } from './PtlSetSession';
import { ReqUpload, ResUpload } from './PtlUpload';
import { MsgExpire } from './user/MsgExpire';
import { ReqLogin, ResLogin } from './user/PtlLogin';
import { ReqLogout, ResLogout } from './user/PtlLogout';

export interface ServiceType {
    api: {
        "action/AdminAction": {
            req: ReqAdminAction,
            res: ResAdminAction
        },
        "action/GuestAction": {
            req: ReqGuestAction,
            res: ResGuestAction
        },
        "action/NormalAction": {
            req: ReqNormalAction,
            res: ResNormalAction
        },
        "database/AddUser": {
            req: ReqAddUser,
            res: ResAddUser
        },
        "database/DelUser": {
            req: ReqDelUser,
            res: ResDelUser
        },
        "database/GetUser": {
            req: ReqGetUser,
            res: ResGetUser
        },
        "database/UpdateUser": {
            req: ReqUpdateUser,
            res: ResUpdateUser
        },
        "Clear": {
            req: ReqClear,
            res: ResClear
        },
        "DownLoad": {
            req: ReqDownLoad,
            res: ResDownLoad
        },
        "GetFileList": {
            req: ReqGetFileList,
            res: ResGetFileList
        },
        "SaveFile": {
            req: ReqSaveFile,
            res: ResSaveFile
        },
        "SelectFile": {
            req: ReqSelectFile,
            res: ResSelectFile
        },
        "SetCookie": {
            req: ReqSetCookie,
            res: ResSetCookie
        },
        "SetSession": {
            req: ReqSetSession,
            res: ResSetSession
        },
        "Upload": {
            req: ReqUpload,
            res: ResUpload
        },
        "user/Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "user/Logout": {
            req: ReqLogout,
            res: ResLogout
        }
    },
    msg: {
        "user/Expire": MsgExpire
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 20,
    "services": [
        {
            "id": 5,
            "name": "action/AdminAction",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "Admin"
                ]
            }
        },
        {
            "id": 6,
            "name": "action/GuestAction",
            "type": "api",
            "conf": {
                "needLogin": false,
                "needRoles": [
                    "Guest"
                ]
            }
        },
        {
            "id": 7,
            "name": "action/NormalAction",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "Normal"
                ]
            }
        },
        {
            "id": 11,
            "name": "database/AddUser",
            "type": "api"
        },
        {
            "id": 12,
            "name": "database/DelUser",
            "type": "api"
        },
        {
            "id": 13,
            "name": "database/GetUser",
            "type": "api"
        },
        {
            "id": 14,
            "name": "database/UpdateUser",
            "type": "api"
        },
        {
            "id": 2,
            "name": "Clear",
            "type": "api"
        },
        {
            "id": 17,
            "name": "DownLoad",
            "type": "api",
            "conf": {}
        },
        {
            "id": 16,
            "name": "GetFileList",
            "type": "api",
            "conf": {}
        },
        {
            "id": 19,
            "name": "SaveFile",
            "type": "api",
            "conf": {}
        },
        {
            "id": 18,
            "name": "SelectFile",
            "type": "api",
            "conf": {}
        },
        {
            "id": 3,
            "name": "SetCookie",
            "type": "api"
        },
        {
            "id": 4,
            "name": "SetSession",
            "type": "api"
        },
        {
            "id": 15,
            "name": "Upload",
            "type": "api"
        },
        {
            "id": 10,
            "name": "user/Expire",
            "type": "msg"
        },
        {
            "id": 8,
            "name": "user/Login",
            "type": "api",
            "conf": {}
        },
        {
            "id": 9,
            "name": "user/Logout",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "action/PtlAdminAction/ReqAdminAction": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "action/PtlAdminAction/ResAdminAction": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "result",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "action/PtlGuestAction/ReqGuestAction": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "action/PtlGuestAction/ResGuestAction": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "result",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "action/PtlNormalAction/ReqNormalAction": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "action/PtlNormalAction/ResNormalAction": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "result",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "database/PtlAddUser/ReqAddUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "newUser",
                    "type": {
                        "target": {
                            "type": "Reference",
                            "target": "../collectionType/DbUser/DbUser"
                        },
                        "keys": [
                            "username",
                            "password"
                        ],
                        "type": "Pick"
                    }
                }
            ]
        },
        "../collectionType/DbUser/DbUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "_id",
                    "type": {
                        "type": "Reference",
                        "target": "?mongodb/ObjectId"
                    }
                },
                {
                    "id": 1,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 2,
                    "name": "username",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 7,
                    "name": "introduction",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 5,
                    "name": "create",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "uid",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 1,
                                "name": "time",
                                "type": {
                                    "type": "Date"
                                }
                            }
                        ]
                    }
                },
                {
                    "id": 6,
                    "name": "update",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "uid",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 1,
                                "name": "time",
                                "type": {
                                    "type": "Date"
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "database/PtlAddUser/ResAddUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "insertedId",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "database/PtlDelUser/ReqDelUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "_id",
                    "type": {
                        "type": "Reference",
                        "target": "?bson/ObjectId"
                    }
                }
            ]
        },
        "database/PtlDelUser/ResDelUser": {
            "type": "Interface"
        },
        "database/PtlGetUser/ReqGetUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "username",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "database/PtlGetUser/ResGetUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "user",
                    "type": {
                        "type": "Reference",
                        "target": "../collectionType/DbUser/DbUser"
                    }
                }
            ]
        },
        "database/PtlUpdateUser/ReqUpdateUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "update",
                    "type": {
                        "type": "Intersection",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "target": {
                                        "type": "Reference",
                                        "target": "../collectionType/DbUser/DbUser"
                                    },
                                    "keys": [
                                        "_id"
                                    ],
                                    "type": "Pick"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Partial",
                                    "target": {
                                        "target": {
                                            "type": "Reference",
                                            "target": "../collectionType/DbUser/DbUser"
                                        },
                                        "keys": [
                                            "username",
                                            "password",
                                            "introduction"
                                        ],
                                        "type": "Pick"
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "database/PtlUpdateUser/ResUpdateUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "matchedCount",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "PtlClear/ReqClear": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "PtlClear/ResClear": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "PtlDownLoad/ReqDownLoad": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "filePath",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlDownLoad/ResDownLoad": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "fileType",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlGetFileList/ReqGetFileList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "directory",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlGetFileList/ResGetFileList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "fileList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "PtlGetFileList/TreeNodeData"
                        }
                    }
                }
            ]
        },
        "PtlGetFileList/TreeNodeData": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "key",
                    "type": {
                        "type": "Union",
                        "members": [
                            {
                                "id": 0,
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 1,
                                "type": {
                                    "type": "Number"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "title",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "selectable",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 3,
                    "name": "disabled",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "disableCheckbox",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 5,
                    "name": "checkable",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 6,
                    "name": "draggable",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 7,
                    "name": "isLeaf",
                    "type": {
                        "type": "Boolean"
                    },
                    "optional": true
                },
                {
                    "id": 8,
                    "name": "children",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "PtlGetFileList/TreeNodeData"
                        }
                    },
                    "optional": true
                },
                {
                    "id": 9,
                    "name": "parent",
                    "type": {
                        "type": "Reference",
                        "target": "PtlGetFileList/TreeNodeData"
                    },
                    "optional": true
                }
            ]
        },
        "PtlSaveFile/ReqSaveFile": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "title",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "filepath",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlSaveFile/ResSaveFile": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "filePath",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlSelectFile/ReqSelectFile": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 1,
                    "name": "selectedTitle",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "filePath",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 4,
                    "name": "fileType",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlSelectFile/ResSelectFile": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "fileType",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "content",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "path",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlSetCookie/ReqSetCookie": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "PtlSetCookie/ResSetCookie": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "PtlSetSession/ReqSetSession": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "PtlSetSession/ResSetSession": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "PtlUpload/ReqUpload": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "fileName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "fileData",
                    "type": {
                        "type": "Buffer",
                        "arrayType": "Uint8Array"
                    }
                }
            ]
        },
        "PtlUpload/ResUpload": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "url",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "user/MsgExpire/MsgExpire": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "user/PtlLogin/ReqLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 2,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 0,
                    "name": "username",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "introduction",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "user/PtlLogin/ResLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "user",
                    "type": {
                        "type": "Reference",
                        "target": "../models/CurrentUser/CurrentUser"
                    }
                }
            ]
        },
        "../models/CurrentUser/CurrentUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "username",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "roles",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "String"
                        }
                    }
                },
                {
                    "id": 3,
                    "name": "introduction",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlLogout/ReqLogout": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlLogout/ResLogout": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        }
    }
};