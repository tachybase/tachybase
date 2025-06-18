<h1 align="center" style="border-bottom: none">
    <div>
        <a style="color:#36f" href="https://www.tachybase.com">
            <img src="https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/3733d6bd0a3376a93ba6180b32194369.png" width="80" />
            <br>
            灵矶
        </a>
    </div>
</h1>

<br>

<p align="center">
  灵矶是一个插件化的应用框架，应用开发者可以基于灵矶做出丰富应用逻辑，而核心开发者可以聚焦于关键模块的稳定性和对不同环境的适配。
</p>
<p align="center">
   <img alt="GitHub License" src="https://img.shields.io/github/license/tachybase/tachybase">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/tachybase/tachybase">
   <img alt="Static Badge" src="https://img.shields.io/badge/build-passing-brightgreen">
   <a href="./README.md"><img alt="Static Badge" src="https://img.shields.io/badge/English Version-red"></a>
   <a href="./README.ZH-CN.md"><img alt="Static Badge" src="https://img.shields.io/badge/中文版本-blue"></a>
   <a href="https://gitee.com/tachybase/tachybase"><img alt="Static Badge" src="https://img.shields.io/badge/gitee-green"></a>
   <a href="https://github.com/tachybase/tachybase"><img alt="Static Badge" src="https://img.shields.io/badge/Github-lightblack"></a>
</p>

# 系统试用

[SaaS 版本](https://apps.tachybase.com/) 

可以自行注册账号密码，在内部建立子应用体验，目前系统处于公测阶段，有任何问题可以及时反馈，我们会在收到的第一时间解决。

# 从 docker compose 快速开始

项目中提供了多个 docker compose 的测试环境，下面以 postgresql 数据例子，您可以通过以下命令快速启动：

```bash 
cd docker-compose-samples/app-postgres
docker compose up -d
# 查看启动日志
docker logs -f

# 访问应用
http://localhost:3000
# 访问 pgadmin 数据库管理
http://localhost:3080
```

# 从源代码快速开始

```bash 
pnpm install
pnpm tachybase install
pnpm dev
```

# 从之前的版本升级

```bash
pnpm install
pnpm tbu
pnpm dev
```

默认的账号为：`tachybase`，默认密码为 `!Admin123.`
默认初始化使用的是 `sqlite` 数据库，可以在 `.env` 文件中修改为其他数据库。

# 开源许可证

本项目遵循  [Apache 2.0](LICENSE) 开源许可证。

# 第三方代码声明

项目中包含大量来自第三方库的代码，例如 RequireJS, JsonLogic, NocoBase、Formily 和 Ant Design（antd）。这些代码遵循其原有的版权和协议要求。未来会逐步进行重构和替换，在项目早期使用时请注意相关授权要求。

# 贡献

- 请提供部署和使用的背景，以及当前系统服务无法满足的情况。根据影响范围，我们会将此纳入不同层次的开发计划（内核、模块或插件）。
- 欢迎分享使用案例，尤其是当前交互方式无法满足需求的场景，我们会根据实际影响范围进行处理。
- 欢迎直接贡献代码，我们暂时没有专门的交流群，您可以通过工单提交想法，我们会一起讨论。
