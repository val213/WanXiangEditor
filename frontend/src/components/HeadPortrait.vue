<template>
    <!-- 未登录的头像 -->
    <a-avatar shape="square"
      :size="50"
      :auto-fix-font-size="true"
      :style="{ backgroundColor: 'lightblue' }"
      @click="handleClick"
      v-if="!isLogin"
      >
      未登录
      <template #trigger-icon>
          <icon-user size="15" :stroke-width='7' style="color: lightblue" />
      </template>
    </a-avatar>
    <!-- 登录框 -->
    <a-modal
      v-model:visible="modalVisible"
      title="登录"
      @cancel="handleCancel && formRef &&formRef.resetFields()"
      @before-ok="handleBeforeOk"
      draggable
    >
      <a-form 
        ref="formRef"
        :model="form"
      >
        <a-form-item field="username" label="用户名">
          <a-input 
          v-model="form.username"
          :style="{ width: '320px' }"
          allow-clear
          />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
          v-model="form.password"
          v-model:visibility="visibility"
          :style="{ width: '320px' }"
          :defaultVisibility="true"
          allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 登录成功后的头像 -->
    <a-avatar shape="square"
      :size="50"
      :auto-fix-font-size="true"
      :style="{ backgroundColor: 'lightblue' }"
      trigger-type='mask'
      v-if="isLogin"
      @click="handleLogout"
      >
      {{username}}
      <template #trigger-icon>
      </template>
    </a-avatar>
</template>


<script>
import { client } from '@/client';
import { Modal } from '@arco-design/web-vue';
import { reactive, ref} from 'vue';

export default {
  setup() {
    // 点击登录后弹出登录框
    const modalVisible = ref(false);
    // 输入框的数据
    const formRef = ref(null);
    const form = reactive({
      username: '',
      password: '',
    });
    // 是否登录
    const isLogin = ref(false);
    // 用户名
    const username = ref('');

    // 初始化登录状态
    isLogin.value = !!localStorage.getItem('SSO_TOKEN');
    username.value = localStorage.getItem('USERNAME');

    // 处理点击头像的事件
    const handleClick = () => {
      modalVisible.value = true;
    };

    // 处理点击弹出的Modal的取消按钮的事件
    const handleCancel = () => {
      modalVisible.value = false;
    };

    // 处理点击弹出的Modal的确定按钮的事件
    const  handleBeforeOk =  async (done) => {
      console.log(form);

      // 调用登录api
      let ret = await client.callApi('user/Login', {
          username: form.username,
          password: form.password,
      });
      // 如果登录失败，弹出错误提示
      if (!ret.isSucc) {
        // console.error(ret.errMsg);
        Modal.error({
          title: '登录失败',
          content: ret.errMsg,
        });
        done(false);
        return;
      }
      // 登录成功，切换头像状态
      isLogin.value = true;
      username.value = form.username;
      formRef.value.resetFields();
      Modal.success({
        title: '登录成功',
        content: '欢迎回来',
      });

      // 延迟3秒后关闭登录框
      window.setTimeout(() => {
        done();
      }, 3000);
    };

    // 处理用户退出登录的事件
    const handleLogout = async () => {
      // 调用登出api
      let ret = await client.callApi('user/Logout', {
      });
      // 如果登出失败，弹出错误提示
      if (!ret.isSucc) {
        Modal.error({
          title: '登出失败',
          content: ret.errMsg,
        });
        return;
      }
      isLogin.value = false;
      username.value = '';
      // 清除localStorage中的token和username，避免占用内存
      localStorage.removeItem('SSO_TOKEN');
      localStorage.removeItem('USERNAME');
      Modal.success({
        title: '登出成功',
        content: '期待您的下次使用',
      });

    };

    return {
      modalVisible,
      form,
      formRef,
      isLogin,
      username,
      handleClick,
      handleCancel,
      handleBeforeOk,
      handleLogout,
    };
  },
};
</script>
