/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 在tsrpc下，可以直接使用ObjectId类型
// 因为前端未安装mongodb，所以需要手动声明
declare module 'mongodb' {
  export type ObjectId = string;
  export type ObjectID = string;
}
declare module 'bson' {
  export type ObjectId = string;
  export type ObjectID = string;
}