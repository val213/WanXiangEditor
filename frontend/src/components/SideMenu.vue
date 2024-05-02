//新功能的前端扩展在这里进,在a-menu-item下添加新的item。
<template>
    <div class="menu">
      <a-menu mode="vertical" :default-selected-keys="['Editor']" @menu-item-click="changeComponent">
        <a-menu-item key="Explorer">Explorer</a-menu-item>
        <a-menu-item key="Editor">Editor</a-menu-item>
        <a-menu-item key="PDF">PDF</a-menu-item>
        <a-menu-item key="Search">Search</a-menu-item>
        <a-menu-item key="新功能">新功能</a-menu-item>
      </a-menu>
    </div>
  </template>
  <style scoped>
  .menu {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
  }
  </style>

<script>
export default {
    methods: {
        //当前组件识别到SideMenuItem点击的动作，执行Input组件名操作，发送Item的key值
        changeComponent(key) {
            //console.log(key);
            this.$emit('componentChange', key);
        },
    }
}
</script>
  