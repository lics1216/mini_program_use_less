小程序 DEMO，使用 gulp 构建（支持 less）

```bash
# 安装依赖
npm install

# 全局安装依赖
npm install gulp prettier typescript --global

# 启动代码
npm run dev

# 打包代码
npm run build
```

小程序引入组件扩展包步骤
1. 在`package.json`中的`dependencies`字段注明引入的一些小程序组件扩展包，如
```
  "dependencies": {
    "miniprogram-computed": "0.0.6",
    "miniprogram-watch": "0.0.2",
    "moment": "^2.23.0",
    "wxapp-session-request": "^1.1.0"
  },
```
2. 依赖的包会被自动打包到`dist` 目录
3. 在小程序开发工具里【工具】-【构建npm】