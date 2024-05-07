<!-- Explorer.vue -->
<template>
<a-space direction="vertical" fill>
  <a-collapse :default-active-key="['']" :bordered="false" destroy-on-hide>
    <a-collapse-item header="打开的编辑器" :key="1">
    </a-collapse-item>
    <a-collapse-item :header="getProjectNameHeader" key="2">
        <template #extra>
            <a-button @click="method.GetTreeData">
            <template #icon>
                <icon-refresh />
            </template>
            </a-button>
        </template> 
        <a-tree
          draggable = true
          blockNode = true
          :data="treeData"
          :show-line="true"
          @drop="onDrop"
        />
    </a-collapse-item>
    <!--<a-collapse-item header="OUTLINE" :key="3">
      <div></div>
    </a-collapse-item>
    <a-collapse-item header="TIMELINE" key="4">
      <div>todo: file saved now</div>
      <div>todo: file saved 1 min</div>
    </a-collapse-item>-->
  </a-collapse>
  <FileUpload />
  </a-space>
</template>

<script>
import { ref, computed } from 'vue';
import FileUpload from './FileUpload.vue';
import { client } from '@/client';
export default {
    props : {
        username:{
            type:String,
            required:true
        },
    },
    components: {
      FileUpload,
    },
    setup(props) {
    const treeData = ref(defaultTreeData);
    const getProjectNameHeader  = computed(() =>{
        return `<项目名>   用户:${props.username}`;
    })

    return {
      getProjectNameHeader,
      treeData,
      onDrop({ dragNode, dropNode, dropPosition }) {
        const data = treeData.value;
        const loop = (data, key, callback) => {
          data.some((item, index, arr) => {
            if (item.key === key) {
              callback(item, index, arr);
              return true;
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
            return false;
          });
        };

        loop(data, dragNode.key, (_, index, arr) => {
          arr.splice(index, 1);
        });

        if (dropPosition === 0) {
          loop(data, dropNode.key, (item) => {
            item.children = item.children || [];
            item.children.push(dragNode);
          });
        } else {
          loop(data, dropNode.key, (_, index, arr) => {
            arr.splice(dropPosition < 0 ? index : index + 1, 0, dragNode);
          });
        }
      },
      method:{
        async GetTreeData(){
    const response = await client.callApi('GetFileList', {});
    client.logger.info('client.callApi返回的数据', response);
    if (response.isSucc) {
        treeData.value = response.res.fileList;
        client.logger.info('成功赋值了treeData.value', treeData);
        client.logger.info('treeData.value',treeData.value);
    } else {
        // 处理错误
        client.logger.error('获取文件列表失败', response);
    }
},
    }

      }
    },
    
  }
  /** 
     data: {
      type: Array as PropType<TreeNodeData[]>,
      default: () => [],
    },
    */
  const defaultTreeData = [
    {
      title: 'Trunk 0-0',
      key: '0-0',
      children: [
        {
          title: 'Leaf 0-0-1',
          key: '0-0-1',
        },
        {
          title: 'Branch 0-0-2',
          key: '0-0-2',
          disableCheckbox: true,
          children: [
            {
              draggable: false,
              title: 'Leaf 0-0-2-1 (Drag disabled)',
              key: '0-0-2-1'
            }
          ]
        },
      ],
    },
    {
      title: 'Trunk 0-1',
      key: '0-1',
      children: [
        {
          title: 'Branch 0-1-1',
          key: '0-1-1',
          checkable: false,
          children: [
            {
              title: 'Leaf 0-1-1-1',
              key: '0-1-1-1',
            },
            {
              title: 'Leaf 0-1-1-2',
              key: '0-1-1-2',
            },
          ]
        },
        {
          title: 'Leaf 0-1-2',
          key: '0-1-2',
        },
      ],
    },
  ]
</script>
