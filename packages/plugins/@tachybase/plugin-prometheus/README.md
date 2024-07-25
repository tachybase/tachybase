# prometheus

English | [中文](./README.zh-CN.md)

## Install

First, edit `.env` to enable the system telemetry and add the prometheus collector

```
TELEMETRY_ENABLED=on
TELEMETRY_METRIC_READER=console,prometheus
TELEMETRY_PROMETHEUS_SERVER=on # If not on, the prometheus server will be registered to prometheus:metrics, note that the standalone prometheus server has NO permission restriction!
TELEMETRY_PROMETHEUS_PORT=9464 # The port of the prometheus server, default to 9464
```

Then enable the plugin

```shell
pnpm pm add @tachybase/plugin-prometheus
pnpm pm enable @tachybase/plugin-prometheus
```

## Usage

TODO
