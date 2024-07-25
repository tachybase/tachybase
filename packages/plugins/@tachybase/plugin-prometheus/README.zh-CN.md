# prometheus

[English](./README.md) | 中文

## 安装激活

首先编辑 `.env`，启用系统的遥测功能并添加采集器 prometheus

```
TELEMETRY_ENABLED=on
TELEMETRY_METRIC_READER=console,prometheus
TELEMETRY_PROMETHEUS_SERVER=on # 如果不为 on，则 prometheus 服务器将注册到 prometheus:metrics ，注意 prometheus 的独立服务器*没有*权限限制！
TELEMETRY_PROMETHEUS_PORT=9464 # prometheus 服务器的端口，默认为 9464
```

然后启用插件

```shell
pnpm pm add @tachybase/plugin-prometheus
pnpm pm enable @tachybase/plugin-prometheus
```

## 使用方法

TODO
