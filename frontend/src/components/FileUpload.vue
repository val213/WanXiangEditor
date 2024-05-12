<template>
  <div>
    <a-space direction="vertical" :style="{ width: '100%' }">
      <a-upload action="/" @before-upload="beforeUpload" @before-remove="beforeRemove" @change="onChange"
        :auto-upload="true" :file-list="fileList" ref="uploadRef" :multiple="true">
        <template #upload-button>
          <a-button> 选择文件</a-button>
        </template>
      </a-upload>
      <a-button type="primary" class="upload-button" @click="startUpload"> 开始上传</a-button>
    </a-space>
  </div>
</template>

<script>
import { client } from '@/client';
import { Modal } from '@arco-design/web-vue';
export default {
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    beforeUpload(file) {
      client.logger.info('beforeUpload', file);
      this.fileList.push({ name: file.name, status: 'ready', uid: file.uid });
      client.logger.info('beforeUpload', this.file);
      this.file = file; // 在这里获取到文件对象，并保存在data属性中
      return false; // 阻止文件自动上传
    },
    beforeRemove(file) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '删除上传列表中的文件',
          content: `确认把${file.name}从上传列表中移除吗？`,
          onOk: () => resolve(true),
          onCancel: () => reject('cancel'),
        });
      });
    },
    onChange(newFileList) {
      this.fileList = newFileList;
    },
    startUpload() {
      this.fileList.forEach(file => {
        if (file.status !== 'done') {
          this.customRequest(file);
        }
      });
    },
    async customRequest(file) {
      client.logger.info('customRequest', this.file);
      if (!this.file) {
        this.$message.error('请先选择文件！');
        return;
      }

      let fileData = await this.loadFile(this.file);
      client.logger.info('fileData', fileData);
      let ret = await client.callApi('Upload', {
        fileData: fileData,
        fileName: this.file.name
      });

      if (!ret.isSucc) {
        this.$message.error(ret.err.message);
        client.logger.error('上传失败！', ret.err);
        file.status = 'error';
        return;
      }
      file.status = 'done';
      client.logger.info('Upload successfully', ret.isSucc);
      this.$message.success('上传成功！');
    },
    loadFile(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = e => {
          if (file.type === 'application/json') {
            try {
              let data = JSON.parse(e.target.result);
              let jsonString = JSON.stringify(data);
              let jsonUint8Array = new TextEncoder().encode(jsonString);
              resolve(jsonUint8Array);
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(new Uint8Array(e.target.result));
          }
        };
        reader.onerror = error => {
          Modal.error({
            title: '文件读取错误',
            content: '您似乎没有该文件的读取权限，请检查文件是否存在或者是否有读取权限。',
          });
          console.error('Error reading file:', error);
          reject(error);
        };
        if (file.type === 'application/json') {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      });
    },
    removeFile(file) {
      const index = this.fileList.indexOf(file);
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
    },
  }
}
</script>
<style scoped>
.upload-button {
  padding: 0 5px;
  /* Adjust this value to match the padding of the other button */

}
</style>