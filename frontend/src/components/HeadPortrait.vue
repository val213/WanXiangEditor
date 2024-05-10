<template class="noneshadow">
    <!-- 未登录的头像 -->
    <a-avatar class='head' shape="square" :size="50" :auto-fix-font-size="true" :style="{ backgroundColor: 'lightblue' } "
       @click="handleClick" v-if="!isLogin" >   
        未登录
        <template #trigger-icon>
            <icon-user size="15" :stroke-width='7' style="color: lightblue" />
        </template>
    </a-avatar>
    <!-- 登录框 -->
    <!-- @before-ok="handleBeforeOk" -->
    <a-modal v-model:visible="modalVisible" title="登录" @cancel="formRef && formRef.resetFields()"
         footer='true' draggable>
        <a-space direction="vertical" align="end">
            <a-form ref="formRef" :model="form">
                <a-form-item field="username" label="用户名">
                    <a-input v-model="form.username" :style="{ width: '320px' }" allow-clear />
                </a-form-item>
                <a-form-item field="password" label="密码">
                    <a-input-password v-model="form.password" :style="{ width: '320px' }" allow-clear />
                </a-form-item>
            </a-form>
        </a-space>
        <template #footer>
            <a-button type="primary" status="success" @click="handleRegister">注册 </a-button>
            <a-button type='primary' @click="handleBeforeOk">登录</a-button>
            <a-button @click='handleCancelLogin'>取消</a-button>
        </template>
    </a-modal>
    <!-- 登录成功后的头像 -->
    
    <a-popover position="bottom" title="个人信息" :style="{ width: '400px', height: '600px'}">
        <a-avatar shape="square" :size="50" :auto-fix-font-size="true" :style="{ backgroundColor: 'lightblue' }"
            trigger-type='mask' v-if="isLogin" @click="handleMouseEnter">     
            {{ username }}
            <template #trigger-icon>
            </template>
        </a-avatar>
        <template #content>
            <div>用户名: {{ username }}</div>
            <div>uid: {{ }}</div>
            <div>个人简介: {{ introduction }}</div>
            <a-button type="primary" @click='handleChangeInfo'>修改个人信息</a-button>
            <a-button @click="handleReadyLogout">退出登录</a-button>
        </template>
    </a-popover>
    <!-- 处理是否确认退出 -->
    <a-modal v-model:visible="readyLogout" 
             :closable="false"
             :footer="true"
             :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center' }"
        >
         <div style="text-align: center;">
            您确定要退出吗？
         </div>
         <template #footer>
            <a-button @click="handleCancelQuit">取消</a-button>
            <a-button type="primary" @click="handleLogout">确定</a-button>
         </template>
    </a-modal>
    <!-- 注册框 -->
    <a-modal v-model:visible="registerVisible" title="注册" @cancel="formRegisterRef && formRegisterRef.resetFields()"
        @before-ok="handleRegisterBeforeOk" draggable>
        <a-form ref="formRegisterRef" :model="formRegister">
            <a-form-item field="newUsername" label="用户名">
                <a-input v-model="formRegister.newUsername" :style="{ width: '320px' }" allow-clear />
            </a-form-item>
            <a-form-item field="password" label="密码">
                <a-input-password v-model="formRegister.password" :style="{ width: '320px' }" allow-clear />
            </a-form-item>
            <a-form-item field="againPassword" label="再次输入密码">
                <a-input-password v-model="formRegister.againPassword" :style="{ width: '320px' }" allow-clear />
            </a-form-item>
        </a-form>
    </a-modal>

    <!-- 个人信息修改框 -->
    <a-modal v-model:visible="changeInfo" title="请修改您的个人信息" footer="true">
        <a-space direction="vertical" align="end">
            <a-form ref="formRef" :model="form">
                <a-form-item field="username" label="用户名">
                    <a-input v-model="infomation.updateUsername" :style="{ width: '320px' }" allow-clear />
                </a-form-item>
                <a-form-item field="introduction" label="简介">
                    <a-textarea v-model="infomation.newIntroduction" :style="{ width: '320px' }" allow-clear />
                </a-form-item>
            </a-form>
        </a-space>
        <template #footer>
            <a-button type="primary" @click="handleConfirmModify">确认修改</a-button>
            <a-button @click="handleCancelModify">取消修改</a-button>
        </template>
    </a-modal>

    <!-- <div @mouseenter="handleMouseEnter">
            <div v-if="isLogin">
            用户名：{{ username }}
            个人简介：
        </div>
            <div v-else>
            未登录
        </div>
    </div> -->
</template>

<script>
import { client } from '@/client';
import { Modal } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';

export default {
    setup(props,context) {
        // const uid = ref('');

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
        if (username.value != 'null') {
            context.emit('login-success', username.value);
       }

        // 处理点击头像的事件
        const handleClick = () => {
            modalVisible.value = true;
        };

        // 处理点击弹出的Modal的确定按钮的事件
        const handleBeforeOk = async (done) => {
            console.log(form);
            // 查找是否存在该用户
            let retGetUser = await client.callApi('database/GetUser', {
                username: form.username,
                // introduction:'',
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
            introduction.value = retGetUser.res.user.introduction;

            // 调用登录api
            let ret = await client.callApi('user/Login', {
                uid: retGetUser.res.user.uid,
                username: retGetUser.res.user.username,
                password: retGetUser.res.user.password,
                introduction: retGetUser.res.user.introduction,
            });
            // 登录成功，切换头像状态
            isLogin.value = true;
            username.value = form.username;
            modalVisible.value = false;
            // uid.value = ret.res.user.uid;
            formRef.value.resetFields();
            context.emit('login-success', username.value);
            Modal.success({
                title: '登录成功',
                content: '欢迎回来',
            });
        };

        // 处理取消登录
        const handleCancelLogin = () =>{
            modalVisible.value = false;
        }

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
            showPersonInfo.value = false;
            changeInfo.value = false;
            readyLogout.value = false;
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

        // 处理展示个人信息事件 用户id 用户名 头像 简介 ...
        // 可添加修改密码选项，暂未实现

        const showPersonInfo = ref(false);
        const introduction = ref('此处可添加您的个人简介');
        const changeInfo = ref(false);
        const handleMouseEnter= async() =>{
            showPersonInfo.value = true;
        }
        const handleMouseLeave = async() =>{
            showPersonInfo.value = false;
        }

        // 处理准备退出
        const readyLogout = ref(false);
        const handleReadyLogout = async() =>{
            readyLogout.value = true;
        }
        // 处理取消退出
        const handleCancelQuit = async() =>{
            readyLogout.value = false;
        }
        // 处理确认修改个人信息
        const handleChangeInfo = async() =>{
            changeInfo.value = true;
        }
        // 处理取消修改个人信息
        const handleCancelModify = async() =>{
            changeInfo.value = false;   //退出修改个人信息框
            showPersonInfo.value = false;  //顺便退出个人信息框
        }
        // 处理修改个人信息
        const infomation = reactive({
            updateUsername: username.value,  //初始名字
            newIntroduction: introduction.value,
        });
        const handleConfirmModify = async() =>{
            let ret1 = await client.callApi('database/GetUser', {
                username: username.value,
            });
            if (!ret1) {
                console.log("获取用户信息失败");
            }

            let ret2 = await client.callApi('database/UpdateUser', { 
                update: {
                    _id: ret1.res.user._id,
                    username: infomation.updateUsername,
                    introduction: infomation.newIntroduction,
                }
            });
            console.log("information"+infomation.newIntroduction);
            if (!ret2) {
                console.log("修改信息失败");
            }
            Modal.success({
                title: '修改成功',
            })
            context.emit('login-success', username.value);
            changeInfo.value = false;  // 退出修改信息框
            showPersonInfo.value = false;  // 顺便退出个人信息框
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
            showPersonInfo,
            handleMouseEnter,
            handleMouseLeave,
            readyLogout,
            handleReadyLogout,
            handleCancelQuit,
            introduction,
            changeInfo,
            handleChangeInfo,
            handleConfirmModify,
            infomation,
            // uid,
            handleCancelModify,
            handleCancelLogin,
        };
    },
};
</script>

<style>
.person-info {
  position:absolute;
  right:10%;
  background-color: white;
  border: 1px solid white;
  box-shadow:none;
  z-index: 500; 
  margin-top: 100px;
}
</style>

<style  scoped>
template{
    background-color: white;
    box-shadow: none;
}
</style>

<!-- .person-info .ant-modal-mask{
    position:absolute;
    /* top:50%;
    left:50%; */
    height:100%;
    width: 100%;
    /* margin-top: 100px; */
}
.person-info .ant-modal-body{
    width:1000px;
}
.person-info .ant-modal-content {
  border-radius: 10px; /* 设置圆角 */
} -->
