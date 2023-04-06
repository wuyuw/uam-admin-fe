# UAM 后台管理-前端

本项目为[UAM 系统](https://github.com/wuyuw/uam)配套的后台管理平台的前端部分，独立维护和部署，需要与 UAM 系统搭配食用！

技术栈：`TypeScript` + `React Hooks` + `Umi` + `Antd` + `Mui`

## 部分页面展示

- 客户端接入管理

  <img title="" src="https://github.com/wuyuw/uam-admin-fe/blob/master/images/client-manage.png?raw=true" alt="客户端管理" data-align="inline">

- 用户管理

  <img title="" src="https://github.com/wuyuw/uam-admin-fe/blob/master/images/user-manage.png?raw=true" alt="用户管理" data-align="inline">

- 用户权限管理

  <img title="" src="https://github.com/wuyuw/uam-admin-fe/blob/master/images/edit-user-permission.png?raw=true" alt="用户权限管理" data-align="inline">

- 权限管理

  <img title="" src="https://github.com/wuyuw/uam-admin-fe/blob/master/images/permission-manage.png?raw=true" alt="权限管理" data-align="inline">

## 开发环境搭建

1. 安装 Node >= 16

2. 安装 pnpm == 8.x

   ```bash
   $ npm install -g pnpm
   ```

   其它安装方式：[https://pnpm.io/zh/installation](https://pnpm.io/zh/installation)

3. 拉取代码

   ```bash
   & git clone git@github.com:wuyuw/uam-admin-fe.git
   ```

4. 安装依赖并启动开发服务器

   ```bash
   $ pnpm install
   $ pnpm dev
   ```

## 基于 Github Actions 的 CI 能力执行自动构建镜像

1. Fork 代码仓库

2. 在仓库导航栏的`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret` 添加 Docker Hub 个人账户的账户名和密码

   账户变量名: `DOCKERHUB_TOKEN` 密码变量名: `DOCKERHUB_USERNAME`

3. 拉取代码

   ```bash
   $ git clone git@github.com:${usename}/uam-admin-fe.git
   ```

4. 打 tag

   ```bash
   $ git tag v0.0.1
   $ git push origin v0.0.1
   ```

5. 点击仓库导航栏的`Actions`选项卡查看 Workflow 执行情况
6. 在 Docker Hub 仓库中确认镜像是否上传成功

## 使用 docker-compose 部署

1. 登录部署服务器并检出代码
2. 在自定义目录创建 nginx 配置文件`nginx.conf`，配置文件模板参考`deploy/nignx.conf`，只需修改 proxy_pass 中的 IP 即可
3. 修改`deploy/docker-compose.yaml`配置文件中 volumns 的 nginx.conf 本地文件路径
4. 替换`deploy/deploy.sh`中 docker 镜像名称中的`wuyuw`为你自己的账户
5. 安装 docker-compose
6. 在项目根目录下执行
   ```bash
   $ bash deploy/deploy.sh -v vx.x.x
   ```
