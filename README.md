<p align="center">
<img alt="WangXiangEditor" src="WangXiang Editor_transparent.png">
<br>
万象世界，一编即览
<br><br>
</p>

<p align="center">
<!-- <a href="README.md">English</a> -->
</p>

# 🔥**万象编辑器**🔥

## ❤️**简介**

**万象编辑器是一款旨在提供“包罗万象”的功能、最大程度的满足用户编辑阅读需求、提供在线协作编辑的共享编辑系统。本项目采用tsrpc框架和中间件Flow进行前后端交互，使用vite构建前端项目，全栈均使用typescript、JavaScript进行开发**

<!-- TODO:插入优化首页后的软件成品图片 -->

## 🛸🛸**功能一览**

* **用户注册登录/个人信息管理**
    
    万象编辑器支持用户注册登录，用户可以通过注册登录功能，管理自己的个人信息；
* **在线文本编辑**
    
    万象编辑器支持txt、md等大部分字符编码文本的编辑需求，并支持本地上传/读写/远端保存/下载的功能；

* **在线多人协作**

    在线协作体现万象编辑器的理念之一———共享，多人在线协作创作是本项目的一大特性之一。万象编辑器提供用户注册登录功能，支持不同用户身份在线实时同步编辑单一用户的文本资源。

* **数据库支持**

    支持部署MongoDB数据库，并连接到本地或者服务端。用户可以自定义使用数据库来存储文本资料；

* **PDF浏览支持**

    初步支持本地PDF上传浏览、服务端拉取PDF浏览、PDF的上传保存。



<!-- * **JavaScript/CSS 代码片段**

* **Typescript支持**

* **template片段** -->

## 🏗️架构设计和开源生态
<!-- * **浏览器/服务端架构**

    万象编辑器采用**Browser/Server**架构，支持客户端与远程服务端进行文件的上传和下载。
     -->
<!-- //TODO:提供架构图片 -->


## 🏆 里程碑
* 项目启动，完成项目的初步架构设计
* 完成基本的文本编辑功能
* 引入MongoDB数据库支持
* SSO单点登录支持
* 登录态和鉴权
* 完成基本的用户注册登录功能
* 弃用BasicEditor,自主开发编辑器组件NotePad
* 客户端构建工具由Vue-cli迁移为Vite
* 引入PDF支持
* 文件上传/读写/远端保存同步/本地备份
* 多人协作技术选型CRDT(Conflict-free Replicated Data Type)
* 引入在线协作支持Yjs和codemirror
* 协作文档持久化存储支持

## 🗺️ 路线图
**万象编辑器后续开发计划和进度**
* 优化在线协作用户体验
* 完善自研编辑器组件NotePad的接口,实现与CRDT协议绑定,用第二种方式实现协作
* 优化PDF传输性能
* 富文本编辑支持
* 代码编辑支持
* PDF标注支持
* 用户个性化定制支持

## 🚀 快速开始

<!-- * **安装nodejs环境**

* **安装Typescript环境**

* **本地安装编辑器** -->


### **安装项目依赖**
在本地部署本项目，需要分别安装服务端和客户端的依赖，分别进入backend和frontend目录，执行依赖自动安装命令：
```bash
cd WanXiangEditor/[backend/frontend]
npm install
```
或者
```bash
cd WanXiangEditor/[backend/frontend]
yarn install
```
> 注意：服务端对于nodejs的版本要求：>=12.0.0

### **启动万象Editor**

在本地部署或者开发本项目，需要分别启动服务端和客户端，分别进入backend和frontend目录，执行启动命令：
```bash
cd WanXiangEditor/[frontend/backend]
npm run dev
```
## 部署
> 前端项目经过一次脚手架的迁移，目前使用vite构建和打包。

```bash
cd WanXiangEditor/[frontend\backend]
npm run build
```
将打包后的前端静态资源和后端文件部署到服务器上，推荐使用`pm2`启动后端服务。
## 鸣谢
万象Editor的诞生离不开众多的开源项目和贡献者，请参考项目源代码 `package.json` 和项目首页。

## 贡献者列表
本项目的起点是准备参加华南理工大学软件学院光锥元软件设计大赛PC端的项目，几乎是我们第一次进行如此规模/形式/技术栈的开发,尚有不足,但今后将持续开发和维护，欢迎大家加入我们，一起为万象编辑器贡献代码。
>欢迎加入我们，一起为万象Editor贡献代码。

<a href="https://github.com/val213/WanXiangEdito/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=val213/WanXiangEditor" />
</a>
