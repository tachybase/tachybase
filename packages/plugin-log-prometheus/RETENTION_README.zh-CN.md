# 用户留存率指标说明

本插件新增了用户留存率相关的指标，用于验证产品能否留住用户。

## 新增指标

### 1. 用户注册相关指标

- `tego_user_registration_timestamp` - 用户注册时间戳
  - 标签：`user_id`
  - 用于计算用户生命周期

- `tego_user_new_users_count` - 每日新增用户数
  - 标签：`date`
  - 用于计算留存率的分母

### 2. 用户活跃状态指标

- `tego_user_daily_activity` - 用户每日活跃状态
  - 标签：`user_id`, `date`
  - 值：1=活跃，0=不活跃
  - 用于判断用户在特定日期是否活跃

### 3. 核心功能操作指标

- `tego_user_core_action_total` - 用户核心功能操作总次数
  - 标签：`user_id`, `action_type`, `date`
  - 用于验证用户不仅登录，还进行了核心操作

### 4. 留存率指标

- `tego_user_retention_next_day` - 次日留存率（百分比）
  - 标签：`date`
  - 计算：次日活跃用户数 / 新增用户数 * 100

- `tego_user_retention_7_day` - 7日留存率（百分比）
  - 标签：`date`
  - 计算：7日后活跃用户数 / 新增用户数 * 100

- `tego_user_retention_30_day` - 30日留存率（百分比）
  - 标签：`date`
  - 计算：30日后活跃用户数 / 新增用户数 * 100

- `tego_user_retained_users_count` - 留存用户数
  - 标签：`retention_type`, `date`
  - `retention_type`: `next_day`, `7_day`, `30_day`

## 使用方法

### 1. 自动记录

插件会自动记录以下事件：

- **用户注册**：当检测到 `users` 资源的 `create` 操作时
- **用户登录**：当检测到 `signIn` 操作时
- **核心功能操作**：当检测到以下操作时：
  - 基础CRUD操作：`create`, `update`, `delete`, `list`, `get`
  - 数据操作：`export`, `import`
  - 功能操作：`share`, `print`
  - 工作流：`workflow`, `approval`
  - 文件操作：`upload`, `download`

### 2. 手动记录

```typescript
import { userLoginMetrics } from '@tachybase/plugin-log-metrics';

// 记录用户注册
await userLoginMetrics.recordUserRegistration('user123', new Date());

// 记录用户核心操作
await userLoginMetrics.recordUserCoreAction('user123', 'posts_create');

// 手动计算留存率
await userLoginMetrics.calculateRetentionRates('2024-01-15');
```

### 3. Prometheus 查询示例

#### 获取昨日留存率
```
tego_user_retention_next_day{date="2024-01-15"}
tego_user_retention_7_day{date="2024-01-08"}
tego_user_retention_30_day{date="2023-12-16"}
```

#### 获取留存用户数
```
tego_user_retained_users_count{retention_type="next_day", date="2024-01-15"}
tego_user_retained_users_count{retention_type="7_day", date="2024-01-08"}
tego_user_retained_users_count{retention_type="30_day", date="2023-12-16"}
```

#### 获取新增用户数
```
tego_user_new_users_count{date="2024-01-15"}
```

#### 获取用户核心操作统计
```
tego_user_core_action_total{action_type="posts_create"}
tego_user_core_action_total{action_type="files_upload"}
```

## Grafana 仪表板查询

### 留存率趋势图
```
# 次日留存率趋势
tego_user_retention_next_day

# 7日留存率趋势
tego_user_retention_7_day

# 30日留存率趋势
tego_user_retention_30_day
```

### 用户活跃度分析
```
# 每日新增用户
tego_user_new_users_count

# 每日留存用户数
tego_user_retained_users_count{retention_type="next_day"}

# 核心操作频率
rate(tego_user_core_action_total[5m])
```

## 数据库要求

确保用户表包含以下字段：

- `id` - 用户ID
- `createdAt` - 用户注册时间
- `lastSignInAt` - 用户最后登录时间

## 计算逻辑

### 留存率计算公式

```
留存率 = (留存用户数 / 新增用户数) × 100%
```

### 计算示例

假设 2024-01-15 新增了 100 个用户：

1. **次日留存率**：2024-01-16 有 30 个用户仍然活跃
   - 留存率 = (30 / 100) × 100% = 30%

2. **7日留存率**：2024-01-22 有 20 个用户仍然活跃
   - 留存率 = (20 / 100) × 100% = 20%

3. **30日留存率**：2024-02-14 有 10 个用户仍然活跃
   - 留存率 = (10 / 100) × 100% = 10%

## 配置选项

### 核心功能操作定义

可以在中间件中修改 `coreActions` 数组来自定义核心功能操作：

```typescript
const coreActions = [
  'create', 'update', 'delete', 'list', 'get', // 基础CRUD操作
  'export', 'import', // 数据导入导出
  'share', 'print', // 分享和打印
  'workflow', 'approval', // 工作流相关
  'upload', 'download', // 文件操作
  // 添加更多核心操作...
];
```

### 计算频率

默认每小时计算一次留存率，可以通过修改 `UserStatsCollector` 的 `intervalMs` 参数调整：

```typescript
// 修改为每天计算一次
start(intervalMs: number = 86400000) // 24小时 = 86400000毫秒
```

## 注意事项

1. **数据延迟**：留存率计算需要等待相应时间窗口的数据，例如30日留存率需要等待30天后才能计算
2. **数据准确性**：确保用户表的 `createdAt` 和 `lastSignInAt` 字段准确记录
3. **性能考虑**：留存率计算涉及数据库查询，建议在非高峰期执行
4. **存储考虑**：历史留存率数据会占用内存，建议定期清理或配置 Prometheus 保留策略

## 故障排除

### 留存率计算为0
1. 检查数据库中的用户数据是否正确
2. 确认 `createdAt` 和 `lastSignInAt` 字段格式
3. 查看日志中的计算过程

### 核心操作不记录
1. 确认操作名称是否在 `coreActions` 列表中
2. 检查用户是否已登录（`ctx.auth?.user?.id` 存在）
3. 确认操作状态为成功（`ctx.status === 200`）

### 指标数据不更新
1. 检查统计数据收集器是否正常运行
2. 确认数据库连接正常
3. 查看应用日志中的错误信息 
