<template>
    <div class="menu">
      <a-menu mode="vertical" :default-selected-keys="['Editor']" @menu-item-click="changeComponent">
        <a-menu-item key="资源管理器">资源管理器</a-menu-item>
        <a-menu-item key="Editor">Editor</a-menu-item>
        <a-menu-item key="PDF">PDF</a-menu-item>
        <a-menu-item key="4">新功能</a-menu-item>
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
        changeComponent(key) {
            //console.log(key);
            this.$emit('componentChange', key);
        },
    }
}
</script>
  