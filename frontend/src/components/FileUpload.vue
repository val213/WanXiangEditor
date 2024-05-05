<template>
    <div>
    <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload
    action="/"
    @before-upload="beforeUpload"
    @before-remove="beforeRemove"
    :auto-upload="true"
    :file-list="fileList"
    ref="uploadRef"
    :multiple="true"
    >
    <template #upload-button>
          <a-button > 选择文件</a-button>
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
    beforeRemove(file){
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: 'on-before-remove',
          content: `确认删除 ${file.name}`,
          onOk: () => resolve(true),
          onCancel: () => reject('cancel'),
        });
      });
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
        this.$message.error('Please select a file');
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
        client.logger.error('Upload fail', ret.err);
        file.status='error';
        return;
      }
      file.status = 'done';
      client.logger.info('Upload successfully', ret.isSucc);
      this.$message.success('Upload successfully!');
    },
    loadFile(file) {
      return new Promise(rs => {
        let reader = new FileReader();
        reader.onload = e => {
          rs(new Uint8Array(e.target.result));
        }
        reader.readAsArrayBuffer(file);
      })
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
    padding: 0 5px;/* Adjust this value to match the padding of the other button */
    
}
</style>