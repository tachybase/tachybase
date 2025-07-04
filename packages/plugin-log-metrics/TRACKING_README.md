# Plugin Log Metrics - 追踪功能

这个插件扩展了原有的用户指标功能，增加了操作追踪能力，将追踪数据作为 Prometheus metrics 提供给监控系统。

## 功能特性

### 1. 操作追踪
- 自动追踪配置的操作执行
- 记录操作执行次数、时长、错误等指标
- 支持按用户、资源、操作类型分组统计

### 2. Prometheus Metrics
提供以下 Prometheus 指标：

#### 操作执行指标
- `tachybase_action_execution_total` - 操作执行总次数
- `tachybase_action_execution_duration_seconds` - 操作执行时长（直方图）
- `tachybase_user_action_total` - 用户操作总次数
- `tachybase_action_error_total` - 操作错误总次数
- `tachybase_tracking_config_total` - 追踪配置总数

#### 用户指标（原有）
- `tachybase_user_daily_login_count` - 每日登录人次
- `tachybase_user_daily_active_users` - 每日活跃用户数
- `tachybase_user_total_registered` - 注册用户总数
- `tachybase_user_login_success_total` - 登录成功次数
- `tachybase_user_login_failure_total` - 登录失败次数

## API 接口

### 追踪指标接口
- `GET /api/log-metrics:getTrackingMetrics` - 获取 Prometheus 格式的追踪指标
- `GET /api/log-metrics:getTrackingMetricsAsJSON` - 获取 JSON 格式的追踪指标
- `POST /api/log-metrics:resetTrackingMetrics` - 重置追踪指标

### 追踪配置管理
- `GET /api/log-metrics:getTrackingConfigs` - 获取追踪配置列表
- `GET /api/log-metrics:getTrackingStats` - 获取追踪统计信息
- `POST /api/log-metrics:createTrackingConfig` - 创建追踪配置
- `POST /api/log-metrics:updateTrackingConfig` - 更新追踪配置
- `POST /api/log-metrics:deleteTrackingConfig` - 删除追踪配置

## 追踪配置

追踪配置存储在 `trackingConfig` 集合中，包含以下字段：

```typescript
{
  title: string;           // 配置标题
  resourceName: string;    // 资源名称
  action: string;          // 操作名称
  enabled: boolean;        // 是否启用
  trackingOptions: {
    meta: string[];        // 要记录的元数据字段
    payload: string[];     // 要记录的载荷字段
    filter?: object;       // 过滤条件
  };
}
```

### 默认配置
插件会自动创建默认的登录追踪配置：

```json
{
  "title": "sign-in",
  "resourceName": "auth",
  "action": "signIn",
  "enabled": true,
  "trackingOptions": {
    "meta": ["userId", "createdAt", "user-agent"],
    "payload": ["errors", "account", "phone"],
    "filter": {
      "$and": [
        {
          "payload": {
            "errors": {
              "$exists": false
            }
          }
        }
      ]
    }
  }
}
```

## 使用示例

### 1. 获取 Prometheus 指标
```bash
curl http://localhost:3000/api/log-metrics:getTrackingMetrics
```

### 2. 创建自定义追踪配置
```bash
curl -X POST http://localhost:3000/api/log-metrics:createTrackingConfig \
  -H "Content-Type: application/json" \
  -d '{
    "values": {
      "title": "user-create",
      "resourceName": "users",
      "action": "create",
      "enabled": true,
      "trackingOptions": {
        "meta": ["userId", "createdAt"],
        "payload": ["email", "nickname"],
        "filter": {}
      }
    }
  }'
```

### 3. 查看追踪统计
```bash
curl http://localhost:3000/api/log-metrics:getTrackingStats
```

## Prometheus 配置

在 Prometheus 配置文件中添加：

```yaml
scrape_configs:
  - job_name: 'tachybase-tracking'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/log-metrics:getTrackingMetrics'
    scrape_interval: 15s
```

## Grafana 仪表板

可以使用以下查询创建 Grafana 仪表板：

### 操作执行频率
```
rate(tachybase_action_execution_total[5m])
```

### 操作执行时长
```
histogram_quantile(0.95, rate(tachybase_action_execution_duration_seconds_bucket[5m]))
```

### 错误率
```
rate(tachybase_action_error_total[5m]) / rate(tachybase_action_execution_total[5m])
```

### 用户活跃度
```
tachybase_user_daily_active_users
```

## 注意事项

1. **性能影响**: 追踪功能会轻微影响 API 响应时间，建议只追踪重要的操作
2. **数据隐私**: 确保追踪配置不会记录敏感信息
3. **存储考虑**: Prometheus 指标会占用内存，定期清理历史数据
4. **多线程**: 追踪功能只在主线程初始化，避免重复配置

## 故障排除

### 常见问题

1. **指标不更新**
   - 检查追踪配置是否正确启用
   - 确认操作是否匹配配置的资源名和操作名

2. **权限错误**
   - 确保用户有访问追踪接口的权限
   - 检查 ACL 配置

3. **内存使用过高**
   - 减少追踪配置数量
   - 调整 Prometheus 抓取间隔
   - 定期重置指标

### 日志调试
启用详细日志：
```bash
DEBUG=plugin-log-metrics:* npm start
``` 
