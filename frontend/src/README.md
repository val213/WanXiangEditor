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
### BasicEditor
### Menu
### StatusBar
### Tabs
### Tree