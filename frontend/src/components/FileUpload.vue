<template>
    <div>
    <a-upload
    action="/"
    @before-upload="beforeUpload"
    :auto-upload="false"
    ref="uploadRef"
    >
    <template #upload-button>
        <a-space>
          <a-button> select file</a-button>
          
        </a-space>
      </template>
    </a-upload><a-button type="primary" @click="customRequest"> start upload</a-button>
  </div>
</template>

<script>
    import { client } from '@/client';
    export default {
        data() {
    return {
    };
  },
  methods: {
    beforeUpload(file) {
        client.logger.info('beforeUpload', file);
        client.logger.info('beforeUpload', this.file);
      this.file = file; // 在这里获取到文件对象，并保存在data属性中
      return false; // 阻止文件自动上传
    },
    async customRequest() {
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
        return;
      }
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
    }
  }
}
</script>