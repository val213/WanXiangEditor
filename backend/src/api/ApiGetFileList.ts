import { ApiCall } from "tsrpc";
import { ReqGetFileList, ResGetFileList } from "../shared/protocols/PtlGetFileList";
import * as fs from 'fs';
import * as path from 'path';
import { VNode } from "vue";
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
    icon?: () => VNode;
    /**
     * @zh 定制 switcher 图标，优先级大于 tree
     * @en Custom switcher icon, priority is greater than tree
     * */
    switcherIcon?: () => VNode;
    /**
     * @zh 定制 loading 图标，优先级大于 tree
     * @en Customize loading icon, priority is greater than tree
     * */
    loadingIcon?: () => VNode;
    /**
     * @zh 定制 drag 图标，优先级大于 tree
     * @en Custom drag icon, priority is greater than tree
     * */
    dragIcon?: () => VNode;
    /**
     * @zh 子节点
     * @en Child node
     * */
    children?: TreeNodeData[];
  }

function buildTreeData(directoryPath: string, parentKey: string = ''): TreeNodeData[] {
    const treeData: TreeNodeData[] = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach((file, index) => {
        const fullPath = path.join(directoryPath, file);
        const key = parentKey ? `0-${parentKey}-${index}` : `0-${index}`;
        const stat = fs.statSync(fullPath);

        let node: TreeNodeData = {
            title: file,
            key: key,
            selectable: true,
            disabled: false,
            disableCheckbox: true,
            checkable: false,
            draggable: true,
            isLeaf: !stat.isDirectory(),
            // 其他属性...
        };

        if (stat.isDirectory()) {
            node.children = buildTreeData(fullPath, key);
        }

        treeData.push(node);
    });

    return treeData;
}

export default async function (call: ApiCall<ReqGetFileList, ResGetFileList>) {
    const directory = "uploads";
    const treeData = buildTreeData(directory, '');
    call.logger?.log('GetFileList', treeData);
    call.succ({ fileList: treeData });
}