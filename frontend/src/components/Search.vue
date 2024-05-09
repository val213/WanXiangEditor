<template>
        <div>
          <a-input-search
            style="margin-bottom: 8px; max-width: 240px"
            v-model="searchKey"
          />
          <a-tree 
          :data="treeData"
          blockNode = true
          @select="onSelect"
          >
            <template #title="nodeData">
        <template v-if="getMatchIndex(nodeData.title) < 0">{{ nodeData.title }}</template>
              <span v-else>
                {{ nodeData?.title?.substr(0, getMatchIndex(nodeData.title))}}
                <span style="color: var(--color-primary-light-4);">
                  {{ nodeData?.title?.substr(getMatchIndex(nodeData.title), searchKey.length) }}
                </span>{{ nodeData?.title?.substr(getMatchIndex(nodeData?.title) + searchKey.length)}}
              </span>
            </template>
          </a-tree>
        </div>
      </template>
      <script>
        import { ref, computed } from 'vue';
        import { client } from '@/client';
        import { onMounted } from 'vue';
        import { Modal } from '@arco-design/web-vue';
        export default {
          setup(props,context) {
            const searchKey = ref('');
            const treeDataFromApi = ref([]);

            const treeData = computed(() => {
              if (!searchKey.value) return treeDataFromApi.value;
              return searchData(searchKey.value);
            })
            
            async function GetTreeData() {
                const response = await client.callApi('GetFileList', {});
                client.logger.info('client.callApi返回的数据', response);
                if (response.isSucc) {
                    treeDataFromApi.value = response.res.fileList;
                    client.logger.info('成功赋值了treeDataFromApi', treeDataFromApi);
                    client.logger.info('treeDataFromApi.value', treeDataFromApi.value);
                } else {
                    // 处理错误
                    client.logger.error('获取文件列表失败', response);
                }
            }

            onMounted(GetTreeData);
                
            function searchData(keyword) {
              const loop = (data) => {
                const result = [];
                data.forEach(item => {
                  if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                    result.push({...item});
                  } else if (item.children) {
                    const filterData = loop(item.children);
                    if (filterData.length) {
                      result.push({
                        ...item,
                        children: filterData
                      })
                    }
                  }
                })
                return result;
              }
      
              return loop(treeDataFromApi.value);
            }
      
            function getMatchIndex(title) {
                // if (!searchKey.value) return -1;
                // // 打印title和searchKey.value
                // console.log(title, searchKey.value);
                // // 打印计算得到的index
                // console.log(title.toLowerCase().indexOf(searchKey.value.toLowerCase()));
              return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
            }

            const onSelect = async (selectedKeys, data) => {
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
            let ret = await client.callApi('SelectFile', {selectedTitle: selectedTitle, filePath: filePath, fileType: extension});
            if (ret.isSucc) {
                client.logger.info('成功获取文件内容', ret);
                    let txtData = ret.res.content;
                    // 将 selectedTitle 和 txtData 传给 tabs 组件
                    client.logger.info('开始传递文件内容', selectedTitle, txtData);
                    context.emit('file-selected', selectedTitle, txtData);
                }
                else {
                // 处理错误
                client.logger.error('获取文件内容失败', ret.res);   
            }
        }
            return {
                searchKey,
                treeData,
                getMatchIndex,
                onSelect,
            }
          },

        }
      </script>
      