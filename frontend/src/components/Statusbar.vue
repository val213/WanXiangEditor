<template>
        <div class="statusbar">
          
        <a-button type="primary" @click="handleClick">关于</a-button>
        <a-drawer :width="340" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
          <template #title>
            About
          </template>
          <div>
            <p>万象编辑器是一款旨在提供“包罗万象”的功能、最大程度的满足用户编辑阅读需求、提供在线协作编辑的共享编辑系统。</p>
            <br>🛸🛸功能一览</br>
            <p>用户注册登录/个人信息管理</p>
            <p>在线文本编辑</p>
            <P>在线多人协作</P>
            <P>持久化存储</p>
            <P>PDF阅读</p>
            <p>...</p> 
          </div>
        </a-drawer>
        </div>
      </template>
      
      <script>
      import { ref } from 'vue';
      export default {
        name: 'Statusbar',
        setup() {
    const visible = ref(false);

    const handleClick = () => {
      visible.value = true;
    };
    const handleOk = () => {
      visible.value = false;
    };
    const handleCancel = () => {
      visible.value = false;
    }

    return {
      visible,
      handleClick,
      handleOk,
      handleCancel
    }
  },
      }
      </script>
      
      <style>
      .statusbar {
        background-color: #f9f9f9;
        padding: .1px;
        text-align: right;
      }
      </style>