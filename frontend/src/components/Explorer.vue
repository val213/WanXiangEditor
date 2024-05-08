<!-- Explorer.vue -->
<template>
<a-space direction="vertical" fill>
  <a-collapse :default-active-key="['']" :bordered="false" destroy-on-hide @change="GetTreeData">
    <a-collapse-item header="打开的编辑器" :key="1">
    </a-collapse-item>
    <a-collapse-item :header="getProjectNameHeader" key="2">
        <a-tree
          draggable = true
          blockNode = true
          :data="treeData"
          :show-line="true"
          @drop="onDrop"
          @select="onSelect"
        >
        <template #extra="nodeData">
        <IconDownload
          style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"
          @click="() => DownLoadIconClick(nodeData)"
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
import { Modal } from '@arco-design/web-vue';
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
    const treeData = ref([]);
    const getProjectNameHeader  = computed(() =>{
        return `<项目名>   用户:${props.username}`;
    })
    const DownLoadIconClick = async (data) => {
        // 在这里处理下载事件
        client.logger.info('DownLoadIconClick 开始',data);
        // 处理文件名->文件路径
        const GetFilePath =(data)=>{
            // 递归获取文件路径
            let filepath = '';
            let parent = data;
            while (parent) {
                filepath = parent.title + '/' + filepath;
                parent = parent.parent;
            }
            // 去掉最后一个'/'
            filepath = filepath.substring(0, filepath.length - 1);
            return filepath;
        };
        let filePath = GetFilePath(data);
        client.logger.info('文件路径', filePath);
        client.logger.info('开始下载文件', data);
        let ret = await client.callApi('DownLoad', {filePath: filePath});
        if (ret.isSucc) {
            client.logger.info('成功获取文件', ret);
            // 在本地新建一个文件,将content写入,实现下载
            let blob = new Blob([ret.res.content], {type: 'text/plain;charset=utf-8'});
            let url = URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.download = 'filename.txt';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            // 文件写入成功
            client.logger.info('成功下载文件', ret);
            Modal.success({
                title: '下载文件成功',
                content: '文件已经下载到本地。',
            });
        }
        else {
            // 处理错误
            client.logger.error('下载文件失败', ret.res);
            Modal.error({
                title: '下载文件失败',
                content: '请检查网络连接是否正常，或者联系管理员。',
            });
        }

    }
    return {
      getProjectNameHeader,
      DownLoadIconClick,
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
    },
    methods: {
        async onSelect(selectedKeys, data){
            client.logger.info('onSelect',selectedKeys, data);
            // 调用接口返回该文件的内容
            const selectedKey = data.node.key;
            const selectedTitle = data.node.title;
            // 根据selectedTitle的文件名后缀判断文件类型
            let parts = selectedTitle.split(".");
            let extension = parts.pop();
            // 判断文件类型是文本文件格式, 就调用接口获取文件内容
            if (extension === 'txt' || extension === 'md' || extension === 'json' || extension === 'js' || extension === 'html' || extension === 'css' || extension === 'py' || extension === 'java' || extension === 'c' || extension === 'cpp' || extension === 'h' || extension === 'hpp' || extension === 'cs' || extension === 'go' || extension === 'php' || extension === 'sql' || extension === 'sh' || extension === 'bat' || extension === 'xml' || extension === 'yaml' || extension === 'yml' || extension === 'ini' || extension === 'conf' || extension === 'cfg' || extension === 'log' || extension === 'properties' || extension === 'gradle') {
                0
            }
            else {
                // 如果不是文本文件格式, 就提示用户不支持该文件类型
                client.logger.info('不支持该文件类型', selectedTitle);
                // 弹出提示框
                Modal.error({
                    title: '不支持该文件类型,请选择文本格式文件~',
                    content: '该文件不会显示在文本编辑器中，因为它要么是二进制文件，要么使用不受支持的文本编码。',
                });
            }
            // 处理文件名->文件路径
            const GetFilePath =(data)=>{
                // 递归获取文件路径
                let filepath = '';
                let parent = data.node;
                while (parent) {
                    filepath = parent.title + '/' + filepath;
                    parent = parent.parent;
                }
                // 去掉最后一个'/'
                filepath = filepath.substring(0, filepath.length - 1);
                return filepath;
            };
            let filePath = GetFilePath(data);
            client.logger.info('文件路径', filePath);
            // 将被选中文件节点的title作为参数去请求接口
            let ret = await client.callApi('SelectFile', {selectedTitle: selectedTitle, filePath: filePath});
            if (ret.isSucc) {
                client.logger.info('成功获取文件内容', ret);
                    let txtData = ret.res.content;
                    // 将 selectedTitle 和 txtData 传给 tabs 组件
                    client.logger.info('开始传递文件内容', selectedTitle, txtData);
                    this.$emit('file-selected', selectedTitle, txtData);
                }
                else {
                // 处理错误
                client.logger.error('获取文件内容失败', ret.res);   
            }
        },
    }
  }
</script>
