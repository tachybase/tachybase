> [!CAUTION]
> 灵矶仍处于 alpha 阶段，若在生产环境中使用，请谨慎。当前代码中包含大量实验性质的代码，未来会进行较多的重构。遇到问题时，欢迎随时联系我们。

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

# 简介

灵矶采用三层结构设计，分别为内核层、模块层和插件层。

- 内核层：提供核心插件机制和统一接口；
- 模块层：实现特定应用功能，例如：使用灵矶构建低代码平台，或作为服务编排工具；
- 插件层：提供更多选择，例如在已有认证机制模块的基础上，插件层可实现不同的认证方式。

目前，灵矶的目标是处理框架本身的核心功能与一部分通用业务逻辑，同时提供一定的无代码与 AI 能力，提升使用的便捷性。灵矶的未来将发展为一个灵活的底座，与不同产品结合，形成独特的定位。

# Snapshots

为开发者，开发者创造，我们提供多种应用模板和示例。

使用灵矶，您将不受限于任何特定的开发形式。它可以是一个独立的 npm 包，在平台中加载，也可以嵌入到现有系统中，或是两者结合进行开发。或者，如果灵矶获得了您的充分信任，您可以以灵矶为核心开发下一个应用。

![case1](https://assets.tachybase.com/imgs/case1.png)
![case2](https://assets.tachybase.com/imgs/case4.png)
![case3](https://assets.tachybase.com/imgs/case3.png)
![case5](https://assets.tachybase.com/imgs/case5.gif)

# 路线图

以下是大致的开发路线图，具体开发计划将在 2025.3.31 前公布，届时会与相关应用模板一起发布。

- [x] 内核：内核 API
- [ ] 内核：消息机制
- [x] 内核：模块 API
- [x] 模块：基于 antd 风格的界面
- [x] 模块：工作流
- [x] 模块：无代码能力
- [x] 模块：云组件
- [ ] 模块：消息队列
- [x] 模块：定时任务
- [x] 插件：工作流 - 审批
- [ ] 插件：工作流 - 数据模板

UI 规划方面，核心的机制设计在内核层，具体组件则由模块层提供。

- [x] 内核：弹窗交互（适用于不脱离上下文的交互情况）
- [x] 内核：标签页交互（适用于同一主题下单一页面无法承载太多内容的交互情况）
- [x] 内核：独立页面（适用于核心主题和分享的情况）
- [x] 模块：基本组件（单行文本、多行文本、数字等）
- [x] 模块：关联组件（子表格、子详情等）
- [x] 模块：专用组件（看板、日历、甘特图、文件浏览器等）


# 系统试用

[Demo 应用](https://demos.tachybase.com/) 

可以自行注册账号密码，在内部建立子应用体验，测试环境非最新的环境，可能存在一些问题。

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
