<!-- Explorer.vue -->
<template>
<a-space direction="vertical" fill>
  <a-collapse :default-active-key="['']" :bordered="false" destroy-on-hide>
    <a-collapse-item header="打开的编辑器" :key="1">
      <div></div>
    </a-collapse-item>
    <a-collapse-item header="<项目名>" key="2">
      <a-collapse :default-active-key="['']" :bordered="false" destroy-on-hide>
        <a-tree
          class="tree-demo"
          draggable = true
          blockNode = true
          :data= "treeData"
          :show-line="true"
          @drop="onDrop"
        />
      </a-collapse>
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
import { ref } from 'vue';
import FileUpload from './FileUpload.vue';
import { Space } from '@arco-design/web-vue';
export default { 
    components: {
      FileUpload,
    },
  setup() {
    const treeData = ref(defaultTreeData);
   
    return {
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
      }
      }
    }
  }

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
