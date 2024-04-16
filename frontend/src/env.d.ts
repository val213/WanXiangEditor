/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// TSRPC would decode ObjectId as string in frontend.
declare module 'mongodb' {
  export type ObjectId = string;
  export type ObjectID = string;
}
declare module 'bson' {
  export type ObjectId = string;
  export type ObjectID = string;
}