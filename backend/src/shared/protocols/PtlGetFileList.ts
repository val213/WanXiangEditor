import { BaseRequest, BaseResponse, BaseConf } from "./base";
export interface TreeNodeData {
    /**
     * @zh 唯一标示
     * @en Unique key
     * */
    key?: string | number;
    /**
     * @zh 该节点显示的标题
     * @en The title of the node
     * */
    title?: string;
    /**
     * @zh 是否允许选中
     * @en Whether to allow selection
     * */
    selectable?: boolean;
    /**
     * @zh 是否禁用节点
     * @en Whether to disable the node
     * */
    disabled?: boolean;
    /**
     * @zh 是否禁用复选框
     * @en Whether to disable the checkbox
     * */
    disableCheckbox?: boolean;
    /**
     * @zh 是否显示多选框
     * @en Whether to show checkbox
     * */
    checkable?: boolean;
    /**
     * @zh 是否可以拖拽
     * @en Whether it can be dragged
     * */
    draggable?: boolean;
    /**
     * @zh 是否是叶子节点。动态加载时有效
     * @en Whether it is a leaf node. Effective when loading dynamically
     * */
    isLeaf?: boolean;
    /**
     * @zh 节点的图标
     * @en Node icon
     * */
    /**
     * @zh 子节点
     * @en Child node
     * */
    children?: TreeNodeData[];
    /**
     * @zh 父节点
     * @en Parent node
     * */
    parent?: TreeNodeData;
  }

export interface ReqGetFileList extends BaseRequest {
    directory?: string;
}

export interface ResGetFileList extends BaseResponse {
    fileList: TreeNodeData[];
}

export const conf: BaseConf = {
    
}