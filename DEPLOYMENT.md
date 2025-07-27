# Cloudflare Pages 部署指南

## 部署步骤

### 1. 准备Git仓库
1. 将项目推送到GitHub、GitLab或Bitbucket
2. 确保所有文件都已提交到仓库

### 2. 在Cloudflare Pages中创建项目
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Pages" 部分
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 授权并选择你的Git仓库

### 3. 配置构建设置
- **Framework preset**: Vue
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (如果项目在仓库根目录)
- **Node.js version**: 18 (会自动从.nvmrc读取)

### 4. 环境变量（如需要）
如果项目需要环境变量，在Cloudflare Pages的设置中添加：
- 进入项目设置
- 找到 "Environment variables" 部分
- 添加所需的环境变量

## 项目配置说明

本项目已经为Cloudflare Pages部署做了以下配置：

1. **`public/_redirects`**: 处理Vue Router的客户端路由
2. **`.nvmrc`**: 指定Node.js版本为18
3. **`package.json`**: 添加了engines字段指定Node.js版本
4. **`vite.config.ts`**: 配置了正确的构建输出目录
5. **`wrangler.toml`**: Cloudflare Workers/Pages配置文件

## 注意事项

- 确保所有依赖都在`package.json`中正确声明
- 构建过程中会自动安装依赖并运行`npm run build`
- 部署完成后，你的应用将在Cloudflare提供的域名上可用
- 可以在Cloudflare Pages设置中配置自定义域名

## 故障排除

如果部署失败，检查：
1. 构建日志中的错误信息
2. 确保所有依赖都已正确安装
3. 检查Node.js版本是否兼容
4. 确保构建命令和输出目录配置正确