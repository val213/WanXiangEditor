
# TSRPC API 接口文档

## 通用说明

- 所有请求方法均为 `POST`
- 所有请求均需加入以下 Header :
    - `Content-Type: application/json`

## 目录

- action
    - [AdminAction](#/action/AdminAction)
    - [GuestAction](#/action/GuestAction)
    - [NormalAction](#/action/NormalAction)
- database
    - [AddUser](#/database/AddUser)
    - [DelUser](#/database/DelUser)
    - [GetUser](#/database/GetUser)
    - [UpdateUser](#/database/UpdateUser)
- user
    - [请求信息：](#/user/Login)
    - [Logout](#/user/Logout)
- [Clear](#/Clear)
- [SetCookie](#/SetCookie)
- [SetSession](#/SetSession)
- [Upload](#/Upload)

---

## action

### AdminAction <a id="/action/AdminAction"></a>

**路径**
- POST `/action/AdminAction`

**请求**
```ts
interface ReqAdminAction {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResAdminAction {
    result: string,
    __ssoToken?: string
}
```

**配置**
```ts
{
  "needLogin": true,
  "needRoles": [
    "Admin"
  ]
}
```

---

### GuestAction <a id="/action/GuestAction"></a>

**路径**
- POST `/action/GuestAction`

**请求**
```ts
interface ReqGuestAction {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResGuestAction {
    result: string,
    __ssoToken?: string
}
```

**配置**
```ts
{
  "needLogin": false,
  "needRoles": [
    "Guest"
  ]
}
```

---

### NormalAction <a id="/action/NormalAction"></a>

**路径**
- POST `/action/NormalAction`

**请求**
```ts
interface ReqNormalAction {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResNormalAction {
    result: string,
    __ssoToken?: string
}
```

**配置**
```ts
{
  "needLogin": true,
  "needRoles": [
    "Normal"
  ]
}
```

---

## database

### AddUser <a id="/database/AddUser"></a>

**路径**
- POST `/database/AddUser`

**请求**
```ts
interface ReqAddUser {
    newUser: {
        username: string,
        password: string
    }
}
```

**响应**
```ts
interface ResAddUser {
    insertedId: string
}
```

---

### DelUser <a id="/database/DelUser"></a>

**路径**
- POST `/database/DelUser`

**请求**
```ts
interface ReqDelUser {
    _id: string
}
```

**响应**
```ts
interface ResDelUser {

}
```

---

### GetUser <a id="/database/GetUser"></a>

**路径**
- POST `/database/GetUser`

**请求**
```ts
interface ReqGetUser {
    username: string
}
```

**响应**
```ts
interface ResGetUser {
    user: {
        _id: /*ObjectId*/ string,
        uid: number,
        username: string,
        password: string,
        create: {
            uid: string,
            time: /*datetime*/ string
        },
        update?: {
            uid: string,
            time: /*datetime*/ string
        }
    }
}
```

---

### UpdateUser <a id="/database/UpdateUser"></a>

**路径**
- POST `/database/UpdateUser`

**请求**
```ts
interface ReqUpdateUser {
    update: { _id: /*ObjectId*/ string } & {
        username?: string,
        password?: string
    }
}
```

**响应**
```ts
interface ResUpdateUser {
    matchedCount: number
}
```

---

## user

### 请求信息： <a id="/user/Login"></a>

- username: 用户名
- password: 密码

**路径**
- POST `/user/Login`

**请求**
```ts
interface ReqLogin {
    uid: number,
    username: string,
    password: string,
    __ssoToken?: string
}
```

**响应**
```ts
interface ResLogin {
    __ssoToken: string,
    user: {
        uid: number,
        username: string,
        roles: string[]
    }
}
```

---

### Logout <a id="/user/Logout"></a>

**路径**
- POST `/user/Logout`

**请求**
```ts
interface ReqLogout {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResLogout {
    __ssoToken?: string
}
```

---

## Clear <a id="/Clear"></a>

**路径**
- POST `/Clear`

**请求**
```ts
interface ReqClear {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResClear {
    __ssoToken?: string
}
```

---

## SetCookie <a id="/SetCookie"></a>

**路径**
- POST `/SetCookie`

**请求**
```ts
interface ReqSetCookie {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResSetCookie {
    __ssoToken?: string
}
```

---

## SetSession <a id="/SetSession"></a>

**路径**
- POST `/SetSession`

**请求**
```ts
interface ReqSetSession {
    __ssoToken?: string
}
```

**响应**
```ts
interface ResSetSession {
    __ssoToken?: string
}
```

---

## Upload <a id="/Upload"></a>

**路径**
- POST `/Upload`

**请求**
```ts
interface ReqUpload {
    fileName: string,
    fileData: /*base64*/ string
}
```

**响应**
```ts
interface ResUpload {
    url: string
}
```

