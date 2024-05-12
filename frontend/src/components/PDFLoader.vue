<template>
    <a-upload action="/" @before-upload="beforeUpload" @before-remove="beforeRemove" :auto-upload="false"
        :file-list="fileList" ref="uploadRef" :multiple="true" :accept="application / pdf">
        <template #upload-button>
            <div style="
          background-color: var(--color-fill-2);
          color: var(--color-text-1);
          border: 1px dashed var(--color-fill-4);
          height: 158px;
          width: 380px;
          border-radius: 2;
          line-height: 158px;
          text-align: center;">
                <div>
                    拖拽PDF到此处 或者
                    <span style="color: #3370FF"> 点击上传PDF</span>
                </div>
            </div>
        </template>
    </a-upload>
    <a-button type="primary" class="upload-button" @click="startUpload"> 开始上传</a-button>
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
        getPdfPath(fileName) {
            console.log("uploads/" + fileName);
            return "uploads/" + fileName;
        },
        getFileType(fileName) {
            //根据fileName的文件名后缀来判断文件类型
            let parts = fileName.split(".");
            let fileType = parts.pop();
            return fileType;
        },
        async beforeUpload(file) {
            client.logger.info('beforeUpload', file);
            client.logger.info('beforeUpload', this.file);
            const isPdf = file.type === 'application/pdf';
            if (!isPdf) {
                this.$message.error('You can only upload PDF files!');
            }
            else {
                this.fileList.push({ name: file.name, status: 'ready', uid: file.uid });
                this.file = file; // 在这里获取到文件对象，并保存在data属性中
            }
            return false; // 阻止文件自动上传
        },
        beforeRemove(file) {
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
                file.status = 'error';
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
