<!-- Explorer.vue -->
<template>
<a-space direction="vertical" fill>
  <a-collapse :default-active-key="['']" :bordered="false" destroy-on-hide @change="method.GetTreeData">
    <a-collapse-item header="打开的编辑器" :key="1">
    </a-collapse-item>
    <a-collapse-item :header="getProjectNameHeader" key="2">
        <!-- <template #extra>
            <a-button @click="method.GetTreeData">
            <template #icon>
                <icon-refresh />
            </template>
            </a-button>
        </template>  -->
        <a-tree
          draggable = true
          blockNode = true
          :data="treeData"
          :show-line="true"
          @drop="onDrop"
          @select="method.onSelect"
        >
        <template #extra="nodeData">
        <IconDownload
          style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"
          @click="() => method.DownLoadIconClick(nodeData)"
        />
      </template>
        </a-tree>
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
import { IconDownload } from '@arco-design/web-vue/es/icon';
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
    setup(props,context) {
    const treeData = ref([]);
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
        async onSelect(selectedKeys, data){
            client.logger.info('onSelect',selectedKeys, data);
            // 调用接口返回该文件的内容/文件路径？
            // 如果是txt文件，通知tabs新建一个tab，显示文件内容
            const selectedKey = data.node.key;
            const selectedTitle = data.node.title;
            // 根据selectedTitle的文件名后缀判断文件类型
            let parts = selectedTitle.split(".");
            let extension = parts.pop();
            if (extension == "txt"){
                // 请求返回txt文件数据
                // 将被选中文件节点的title作为参数去请求接口
                let ret = await client.callApi('SelectFile', {selectedTitle: selectedTitle});
                if (ret.isSucc) {
                    // 成功
                    client.logger.info('成功获取文件内容', ret);
                    if (ret.res.fileType == ".txt"){
                        let txtData = ret.res.content;
                        // 将 selectedTitle 和 txtData 传给 tabs 组件
                        client.logger.info('开始传递文件内容', selectedTitle, txtData);
                        context.emit('file-selected', selectedTitle, txtData);
                    }
                } else {
                    // 处理错误
                    client.logger.error('获取文件内容失败', ret.res);
                }
            }
        },
        DownLoadIconClick(nodeData){
            client.logger.info('DownLoadIconClick',nodeData);


        }
    }

      }
    },
    
  }
</script>
