# Document for WangXiangEditor frontend
---
author: 
        val213,

---
本文档是万象编辑器的前端开发文档。
## 前端项目结构
- main.ts 组件库的完整依赖引入写在这个文件中
- app.vue 入口文件
- components 组件
        - BasicEditor.vue 使用 WangEditor库中的基础编辑器组件
        - Menu.vue 使用 @arco-design/web-vue的菜单组件
        - Sidebar.vue 使用 @arco-design/web-vue 
        - Statusbar.vue 简陋的自编组件
        - Tabs.vue 使用 @arco-design/web-vue 的Tab组件
        - Tree.vue 使用 @arco-design/web-vue 的树形结构组件
        - Chatroom 原框架中的demo组件，保留仅供参考
- shared 前后端共享代码，在后端项目代码中编辑后会自动同步        
## 前端依赖库
-（使用`npm i`或者`yarn install`命令自动安装依赖）
- WangEditor 
        - 文档链接：https://www.wangeditor.com/v5/getting-started.html
        - 文档写的一般，这个组件一开始就引入了就先用着，二次开发的话根据文档改过代码，感觉没有想象中的效果
- @arco-design/web-vue 
        - 标签<a-xxx>开头的一般就是这个库的组件
        - 文档链接：https://arco.design/vue/docs/start
        - 官方文档中有在线的代码示例（codesandbox等工具），可以直接copy下来当组件用，也可以按照需求改改
## app.vue
template中，使用了 @arco-design/web-vue 的伸缩边框布局，然后把各种其他组件引入到了布局里面。

使用新组件的时候，要先import，然后加到script中的
```ts
export default {
  name: 'App',
  components: {
  ...，//添加在这里
  }
  }
```
最后在template里用上，否则会报错。
## Components 
### Notepad 编辑器
### Menu 顶部菜单栏
### StatusBar 底部状态栏
### Tabs 标签页
### SideMenu 左侧功能栏
实现右侧组件随选中的功能动态切换，在SideMenu.vue文件中添加a-menu-item，并在app.vue中添加组件即可实现动态切换。
```html
<template>
  <!--新功能的前端扩展在这里进,在a-menu-item下添加新的item。-->
    <div class="menu">
      <a-menu mode="vertical" :default-selected-keys="['Explorer']" @menu-item-click="changeComponent">
        <a-menu-item key="Explorer"><icon-home :size="25"/></a-menu-item>
        <a-menu-item key="Search"><icon-find-replace :size="25"/></a-menu-item>
        <a-menu-item key="PDFLoader"><icon-file-pdf :size="25"/></a-menu-item>
      </a-menu>
    </div>
</template>
```
### HeadPortrait 头像/用户模块
### explorer
#### 打开的文件列表
- todo：展示用户已经打开的文件的列表，点击文件名可以切换到对应的文件。

#### 项目名
- 显示登录状态，未登录或者用户名
- 刷新按钮触发GetFileList接口调用，获取服务端的文件列表（默认uploads目录下），暂未做用户级别的隔离，接口响应中的树状对象列表更新到Tree的data中。

### Search 搜索功能
- 搜索框，输入关键字，点击搜索按钮，触发搜索功能，搜索结果展示在下方的列表中。
- todo：点击搜索结果，可以打开对应的文件。
- todo：搜索范围为服务端的文件列表，暂未做用户级别的隔离。

### FileUpload 文件上传 与 PDFUploader PDF文件上传
客户端的文件上传功能，支持上传各种格式的文件到服务端的uploads目录(`backend/uploads`)下。PDFUploader是FileUpload的特例，做了类型限制，只支持PDF文件的上传。



