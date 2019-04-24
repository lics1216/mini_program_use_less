小程序 DEMO

- 使用 gulp 构建（支持 less）

```bash
# 安装依赖
npm install

# 全局安装依赖
npm install gulp prettier typescript --global

# 启动代码
npm run dev

# 需要在小程序开发工具里【工具】-【构建npm】

# 打包代码
npm run build
```

**注意：`package.json`中的`dependencies`字段，依赖的包会被自动打包到`dist`里。**