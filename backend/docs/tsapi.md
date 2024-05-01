
# TSRPC API 接口文档

## 通用说明

- 所有请求方法均为 `POST`
- 所有请求均需加入以下 Header :
    - `Content-Type: application/json`

## 目录

- [Send](#/Send)

---

## Send <a id="/Send"></a>

**路径**
- POST `/Send`

**请求**
```ts
interface ReqSend {
    content: string
}
```

**响应**
```ts
interface ResSend {
    time: /*datetime*/ string
}
```

