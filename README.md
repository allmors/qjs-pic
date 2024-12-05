# qjs-pic

#### 什么qjs-pic

qjs-pic采用qjs低代码框架提供的文件上传功能来进行接口开发，qjs是一个非常容易上手的低代码库，非常适合大前端想入门的新手，qjs集成了`jwt` `bson` 等内置工具，传送门：[https://github.com/allmors/qjs](https://github.com/allmors/qjs)

demo：[https://demo.navs.eu.org](https://https://demo.navs.eu.org)

> 演示地址每天00:00数据重置，请勿生产使用（服务为临期rn，不再续费）

## 如何开始？

```
git clone https://github.com/allmors/qjs-pic.git
```

### 常规部署
执行以下命令：
#### 部署后端

```
cd backend
```

```
npm start
```

#### 部署前端

```
编辑.env，修改为后端地址
```

```
npm install && npm build
```

```
npm start
```

### Docker部署
```
docker compose up -d --build
```

### 功能

- [x] 文件上传
- [ ] 后台文件管理
- [ ] 登录

### 配置

相关服务配置

#### caddy
- 常规部署
```
demo.navs.eu.org {
    reverse_proxy /api/* 127.0.0.1:56553
    
    handle_path /uploads/* {
        root * /path/qjs-pic/backend/uploads
        file_server
    }
    
    reverse_proxy * http://127.0.0.1:3000
}
```
- Docker部署
```
demo.navs.eu.org {
    handle_path /uploads/* {
        root * /path/qjs-pic/uploads
        file_server
    }
    
    reverse_proxy * http://127.0.0.1:3000
}
```

#### nginx

无

### 其它

如有需要请自行修改相关配置及代码，有什么功能需求可直接issues或者动手能力强的自行二开
