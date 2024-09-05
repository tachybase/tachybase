# multi-app-manager

English | [中文](./README.zh-CN.md)

多应用管理插件。

## 安装激活

```bash
yarn pm enable multi-app-manager
```

## 使用方法

注意目前仅支持部分在应用启动时传入的环境变量，具体列表如下：

```ini
APP_KEY=test-key
API_BASE_PATH=/api/
DB_DIALECT=sqlite
DB_STORAGE=storage/db/tachybase.sqlite
DB_TABLE_PREFIX=
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=tachybase
DB_PASSWORD=tachybase
DB_UNDERSCORED=false
DB_TIMEZONE=+08:00
DB_TABLE_PREFIX=
DB_SCHEMA=
CACHE_DEFAULT_STORE=memory
CACHE_MEMORY_MAX=2000
```

