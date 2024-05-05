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
      @cancel="formRef && formRef.resetFields()"
      @before-ok="handleBeforeOk"
      draggable
    >
    <a-space 
     direction="vertical"
     align="end"
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
          :style="{ width: '320px' }"
          allow-clear
          />
        </a-form-item>
      </a-form>
      <a-button 
        type="primary"
        status="success"
        @click="handleRegister"
      >
        注册
      </a-button>
    </a-space>
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
    <!-- 注册框 -->
    <a-modal
      v-model:visible="registerVisible"
      title="注册"
      @cancel="formRegisterRef && formRegisterRef.resetFields()"
      @before-ok="handleRegisterBeforeOk"
      draggable
    >
      <a-form 
        ref="formRegisterRef"
        :model="formRegister"
      >
        <a-form-item field="newUsername" label="用户名">
          <a-input 
          v-model="formRegister.newUsername"
          :style="{ width: '320px' }"
          allow-clear
          />
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password
          v-model="formRegister.password"
          :style="{ width: '320px' }"
          allow-clear
          />
        </a-form-item>
        <a-form-item field="againPassword" label="再次输入密码">
          <a-input-password
          v-model="formRegister.againPassword"
          :style="{ width: '320px' }"
          allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
</template>


<script>
import { client } from '@/client';
import { Modal } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';

export default {
  setup(props, context) {
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

    // 是否显示注册框
    const registerVisible = ref(false);
    const formRegisterRef = ref(null);
    const formRegister = reactive({
      newUsername: '',
      password: '',
      againPassword: '',
    });

    // 初始化登录状态
    isLogin.value = !!localStorage.getItem('SSO_TOKEN');
    username.value = localStorage.getItem('USERNAME');

    // 处理点击头像的事件
    const handleClick = () => {
      modalVisible.value = true;
    };

    // 处理点击弹出的Modal的确定按钮的事件
    const  handleBeforeOk =  async (done) => {
      console.log(form);
      // 查找是否存在该用户
      let retGetUser = await client.callApi('database/GetUser', {
        username: form.username,
      });
      console.log("retGetUser: ", retGetUser);
      // 用户不存在
      if (!retGetUser) {
        Modal.errro({
          title: '用户名不存在',
          content: '请检查用户名是否正确',
        });
        done(false);
        return;
      }
      // 检查密码是否正确
      if (retGetUser.res.user.password != form.password) {
        Modal.error({
          title: '密码错误',
          content: '请检查密码是否正确',
        });
        done(false);
        return;
      }

      // 调用登录api
      let ret = await client.callApi('user/Login', {
        uid: retGetUser.res.user.uid,
        username: retGetUser.res.user.username,
        password: retGetUser.res.user.password,
      });

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
      context.emit('login-success', username.value);
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
      context.emit('login-success', '未登录');
    };


    // 处理注册按钮事件
    const handleRegister = () => {
      registerVisible.value = true;
      formRef.value.resetFields();
    }

    // 处理注册框确定事件
    const handleRegisterBeforeOk = async (done) => {
      // 先判断两次输入的密码是否一致
      if (formRegister.password !== formRegister.againPassword) {
        Modal.error({
          title: '注册失败',
          content: '两次输入的密码不一致',
        });
        done(false);
        return;
      }

      // 调用添加新用户api
      let ret = await client.callApi('database/AddUser', {
        newUser: {
          username: formRegister.newUsername,
          password: formRegister.password,
        }
      });
      if (!ret) {
        console.log("注册失败");
      }

      // 延迟3秒后关闭登录框
      window.setTimeout(() => {
        done();
      }, 3000);
    }



    return {
      modalVisible,
      form,
      formRef,
      isLogin,
      username,
      registerVisible,
      formRegisterRef,
      formRegister,
      handleClick,
      handleBeforeOk,
      handleLogout,
      handleRegister,
      handleRegisterBeforeOk,
    };

  },

};
</script>



