<h1 align="center" style="border-bottom: none">
    <div>
        <a style="color:#36f" href="https://www.tachybase.com">
            <img src="https://private-user-images.githubusercontent.com/4080924/376667122-0930a0f2-41ab-4dff-9646-8f6daade2829.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjkwMDQwODYsIm5iZiI6MTcyOTAwMzc4NiwicGF0aCI6Ii80MDgwOTI0LzM3NjY2NzEyMi0wOTMwYTBmMi00MWFiLTRkZmYtOTY0Ni04ZjZkYWFkZTI4MjkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MTAxNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDEwMTVUMTQ0OTQ2WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OTUyOTUwNDNjNzZmZWEyZDc1ODk2Y2VmNDcwODM0NzMyMTJlNjA5ZTM3MzM4MGI5YTU0MTE2NWQwMDBhMTA0NiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.3QbOn5LhUVGBMWp6JJYE-NFnDqZbV0HHDuZ8QVLVAdI" width="80" />
            <br>
            塔奇平台
        </a>
    </div>
</h1>

<br>



<p align="center">
<span style="color:red; font-weight:bold;">目前框架还在 alpha 阶段，用在生产中请谨慎，碰到任何问题可以联系我们处理</span>
<br>
塔奇平台（Tachybase）致力于打造一个用户友好的应用研发平台，旨在降低开发门槛，提升研发效率，为企业用户和开发者提供一站式解决方案。
</p>

# 其他语言

[[English Version](README.EN-US.md)][中文版本]
# 安装

## 使用 Sqlite 开始

```bash 
pnpm install
pnpm tachybase install
pnpm dev
```

默认的账号为：`tachybase`，默认密码为 `!Admin123.`

# 特性

### 丰富的操作界面

- ⚡ &nbsp;基本操作：对表、列和行进行增删改查
- ⚡ &nbsp;字段操作：排序、过滤、隐藏/取消隐藏列
- ⚡ &nbsp;多种数据视图：看板、日历、网格
- ⚡ &nbsp;视图权限：协作视图和锁定的视图
- ⚡ &nbsp;丰富的数据类型：ID、链接到另一记录、查找、滚动、单行文本、附件、货币、公式等
- ⚡ &nbsp;基于角色的访问控制：不同层次的精细化地控制访问
- ⚡ &nbsp;以及更多......

### 自动化工作流与审批流

我们提供了无代码、低代码形式的工作流，通过丰富的触发时机，巧妙满足业务上的不同需求，针对通用的办公审批情况，我们定制了我们的一种方案，在这里
总是可以自行拓展定制更符合业务情况的流程。

- ⚡ &nbsp;外部 API、内部 API、定时、数据发生变动等等，可以扩展的触发时机
- ⚡ &nbsp;调用外部 HTTP 请求、接入飞书、企业微信、钉钉机器人
- ⚡ &nbsp;接入 AI 机器人，包含 kimi、豆包等等

### 使用 API 编程访问

我们提供以下方式让用户以编程方式调用操作。 您可以使用 Token 来签署您对 Tachybase 授权的请求。

- ⚡ &nbsp;REST APIs
- ⚡ &nbsp;Tachybase SDK

# 应用模板
正在制作中，预计春节前上线，目前开放测试，欢迎联系
![应用模板](https://private-user-images.githubusercontent.com/4080924/377728453-d567d671-734c-43a3-9b62-527216925946.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjkyMjgyMjAsIm5iZiI6MTcyOTIyNzkyMCwicGF0aCI6Ii80MDgwOTI0LzM3NzcyODQ1My1kNTY3ZDY3MS03MzRjLTQzYTMtOWI2Mi01MjcyMTY5MjU5NDYucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MTAxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDEwMThUMDUwNTIwWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZGEwZWMyOTE1YWM5MGY4ZDY0NjI4ZjE1MjY0Y2FmMzIxNGU3MmVkMTg0ZGZmZGIwNTk2NDViZTRhNGQwYTk4ZiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.GZlKlr8bivoUG9QgpIjWqJ0B3eivXoTbi-3rERMtyUA)

# 我们为什么要做这个？

大多数互联网企业都为自己配备了电子表格或数据库来解决他们的业务需求。每天有十亿多人协作使用电子表格。然而，我们在数据库上以类似的效率工作还有很长的路要走，这些数据库在计算方面是更强大的工具。使用 SaaS 产品解决这个问题意味着可怕的访问控制、供应商锁定、数据锁定、突然的价格变化以及最重要的是未来可能出现的玻璃天花板。

# 我们的任务

我们的使命是为数据库提供最强大的无代码接口，并向世界上每一个互联网企业开放源代码。这不仅能让这个强大的计算工具开放给每个人，而且10亿或更多的人将会在互联网上拥有激进的修补和建设能力。

# 开源许可证

<p>
此项目在 <a href="./LICENSE">Apache 2.0</a> 下.
</p>

# 贡献

我们不限制贡献的方式，积极使用该项目，向我们回馈就是最大的贡献。

- 使用
- 提建议
- 提合并请求
