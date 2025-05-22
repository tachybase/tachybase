<h1 align="center" style="border-bottom: none">
    <div>
        <a style="color:#36f" href="https://www.tachybase.com">
            <img src="https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/3733d6bd0a3376a93ba6180b32194369.png" width="80" />
            <br>
            Tachybase
        </a>
    </div>
</h1>

<br>

<p align="center">
  Tachybase is a pluggable application framework., where developers can build complex application logic, while core developers focus on ensuring the stability of key modules and adapting to different environments. 
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

# Try

[SaaS Version](https://apps.tachybase.com/) 

You can register an account and password by yourself and create sub-applications within the system to try it out. The system is currently in public beta. If you encounter any issues, feel free to provide feedback, and we will address them as soon as possible.

# Quick Start with Docker Compose

We provides multiple Docker Compose test environments. Here's an example using a PostgreSQL database. You can quickly start with the following commands:

```bash 
cd docker-compose-samples/app-postgres
docker compose up -d
# View startup logs
docker logs -f

# Visit app
http://localhost:3000
# Visit pgadmin
http://localhost:3080
```

# Quick Start from Source Code

```bash 
pnpm install
pnpm tachybase install
pnpm dev
```

# Upgrade From Previous Version

```bash
pnpm install
pnpm tbu
pnpm dev
```

Default username：`tachybase`，password: `!Admin123.`
The default database is `sqlite`, you can change it in .env file.

# License

This project is licensed under the [Apache 2.0](LICENSE) License。

# Third-party Code Notice

The project includes a significant amount of code from third-party libraries such as RequireJS, JsonLogic, NocoBase, Formily, and Ant Design (antd). This code adheres to their original licenses and agreements. It will be gradually rewritten in the future. Please be mindful of this when using it in the early stages of the project.

# Contributing

- Provide background information on deployment and usage, and describe the situations where the current system services fall short. Depending on the impact, we will categorize this into different development levels (Kernel, Module, or Plugin).
- Share usage cases where the current interaction methods do not meet your needs. We will address these based on their impact level.
- You are welcome to directly contribute code. We currently do not have a dedicated community group, but you can submit ideas through tickets, and we can discuss them together.
