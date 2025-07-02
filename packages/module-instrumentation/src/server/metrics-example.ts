import { Counter, Gauge, Histogram, metrics, utils } from './metrics';

// 配置应用名称
// 配置应用前缀
// 配置上报地址

// 示例 1: 使用预定义的指标
export class MetricsExample {
  private appName: string;
  private labeledMetrics: ReturnType<typeof utils.createLabeledMetrics>;

  constructor(appName: string = 'my-app') {
    this.appName = appName;
    this.labeledMetrics = utils.createLabeledMetrics(appName);
  }

  // HTTP 请求埋点示例
  async trackHttpRequest(method: string, path: string) {
    const timer = this.labeledMetrics.http.requestDuration(method, path);

    try {
      // 模拟 HTTP 请求
      const response = await this.makeHttpRequest(method, path);

      // 记录成功的请求
      this.labeledMetrics.http.requestsTotal(method, path, response.status);

      return response;
    } catch (error) {
      // 记录失败的请求
      this.labeledMetrics.http.requestsTotal(method, path, 500);
      throw error;
    } finally {
      // 结束计时器
      timer();
    }
  }

  // 数据库操作埋点示例
  async trackDatabaseQuery(operation: string, table: string) {
    const timer = this.labeledMetrics.database.queryDuration(operation, table);

    try {
      // 记录查询开始
      this.labeledMetrics.database.queriesTotal(operation, table);

      // 模拟数据库查询
      const result = await this.executeDatabaseQuery(operation, table);

      return result;
    } catch (error) {
      // 记录数据库错误
      this.labeledMetrics.database.errors(operation, table);
      throw error;
    } finally {
      // 结束计时器
      timer();
    }
  }

  // 业务操作埋点示例
  async trackBusinessAction(action: string, collection: string) {
    const timer = this.labeledMetrics.business.actionDuration(action, collection);

    try {
      // 记录业务操作开始
      this.labeledMetrics.business.actionsTotal(action, collection);

      // 模拟业务操作
      const result = await this.executeBusinessAction(action, collection);

      // 根据操作类型记录相应的指标
      if (action === 'create') {
        this.labeledMetrics.business.recordsCreated(collection);
      } else if (action === 'update') {
        this.labeledMetrics.business.recordsUpdated(collection);
      } else if (action === 'delete') {
        this.labeledMetrics.business.recordsDeleted(collection);
      }

      return result;
    } catch (error) {
      // 记录业务错误
      this.labeledMetrics.errors.total('business');
      throw error;
    } finally {
      // 结束计时器
      timer();
    }
  }

  // 系统资源监控示例
  trackSystemResources() {
    // 模拟获取系统资源信息
    const memoryUsage = process.memoryUsage();
    const cpuUsage = this.getCpuUsage();
    const diskUsage = this.getDiskUsage();

    // 记录内存使用情况
    this.labeledMetrics.system.memoryUsage('heap_used', memoryUsage.heapUsed);
    this.labeledMetrics.system.memoryUsage('heap_total', memoryUsage.heapTotal);
    this.labeledMetrics.system.memoryUsage('external', memoryUsage.external);
    this.labeledMetrics.system.memoryUsage('rss', memoryUsage.rss);

    // 记录 CPU 使用情况
    this.labeledMetrics.system.cpuUsage(cpuUsage);

    // 记录磁盘使用情况
    this.labeledMetrics.system.diskUsage('/', diskUsage);
  }

  // 缓存操作埋点示例
  trackCacheOperation(cacheName: string, operation: 'hit' | 'miss') {
    if (operation === 'hit') {
      this.labeledMetrics.cache.hits(cacheName);
    } else {
      this.labeledMetrics.cache.misses(cacheName);
    }
  }

  // 错误埋点示例
  trackError(errorType: string, error: Error) {
    this.labeledMetrics.errors.total(errorType);

    // 可以在这里添加错误率计算逻辑
    // 这里简化处理，实际应用中可能需要更复杂的计算
  }

  // 模拟方法
  private async makeHttpRequest(method: string, path: string) {
    // 模拟 HTTP 请求
    return { status: 200 };
  }

  private async executeDatabaseQuery(operation: string, table: string) {
    // 模拟数据库查询
    return { success: true };
  }

  private async executeBusinessAction(action: string, collection: string) {
    // 模拟业务操作
    return { success: true };
  }

  private getCpuUsage(): number {
    // 模拟获取 CPU 使用率
    return Math.random() * 100;
  }

  private getDiskUsage(): number {
    // 模拟获取磁盘使用量
    return Math.random() * 1024 * 1024 * 1024; // 随机字节数
  }
}

// 示例 2: 创建自定义指标
export class CustomMetrics {
  private customCounter: Counter;
  private customGauge: Gauge;
  private customHistogram: Histogram;

  constructor() {
    // 创建自定义计数器
    this.customCounter = new Counter('custom_events_total', 'Total number of custom events', {
      labels: ['event_type', 'user_id'],
    });

    // 创建自定义仪表盘
    this.customGauge = new Gauge('custom_current_value', 'Current value of custom metric', {
      labels: ['metric_name'],
    });

    // 创建自定义直方图
    this.customHistogram = new Histogram('custom_duration_seconds', 'Duration of custom operations', {
      labels: ['operation_type'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });
  }

  // 记录自定义事件
  trackCustomEvent(eventType: string, userId: string) {
    this.customCounter.increment({ event_type: eventType, user_id: userId });
  }

  // 设置自定义值
  setCustomValue(metricName: string, value: number) {
    this.customGauge.set(value, { metric_name: metricName });
  }

  // 记录自定义操作时长
  trackCustomOperation(operationType: string) {
    return this.customHistogram.startTimer({ operation_type: operationType });
  }
}

// 示例 3: 中间件示例
export function createMetricsMiddleware(appName: string) {
  const labeledMetrics = utils.createLabeledMetrics(appName);

  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const timer = labeledMetrics.http.requestDuration(req.method, req.path);

    // 记录请求开始
    labeledMetrics.http.requestsTotal(req.method, req.path, 200);

    // 监听响应结束
    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000; // 转换为秒

      // 记录请求结束
      labeledMetrics.http.requestsTotal(req.method, req.path, res.statusCode);

      // 结束计时器
      timer();
    });

    next();
  };
}

// 示例 4: 定期收集系统指标
export class SystemMetricsCollector {
  private appName: string;
  private labeledMetrics: ReturnType<typeof utils.createLabeledMetrics>;
  private interval: NodeJS.Timeout | null = null;

  constructor(appName: string = 'system-monitor') {
    this.appName = appName;
    this.labeledMetrics = utils.createLabeledMetrics(appName);
  }

  start(intervalMs: number = 60000) {
    // 默认每分钟收集一次
    this.interval = setInterval(() => {
      this.collectSystemMetrics();
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private collectSystemMetrics() {
    // 收集内存使用情况
    const memUsage = process.memoryUsage();
    this.labeledMetrics.system.memoryUsage('heap_used', memUsage.heapUsed);
    this.labeledMetrics.system.memoryUsage('heap_total', memUsage.heapTotal);
    this.labeledMetrics.system.memoryUsage('external', memUsage.external);
    this.labeledMetrics.system.memoryUsage('rss', memUsage.rss);

    // 收集 CPU 使用情况（简化版本）
    const cpuUsage = this.calculateCpuUsage();
    this.labeledMetrics.system.cpuUsage(cpuUsage);
  }

  private calculateCpuUsage(): number {
    // 这里应该实现真实的 CPU 使用率计算
    // 简化版本，返回随机值
    return Math.random() * 100;
  }
}

// 使用示例
export async function exampleUsage() {
  // 创建指标示例实例
  const metricsExample = new MetricsExample('my-app');
  const customMetrics = new CustomMetrics();
  const systemCollector = new SystemMetricsCollector('my-app');

  // 开始系统指标收集
  systemCollector.start();

  try {
    // 模拟一些操作
    await metricsExample.trackHttpRequest('GET', '/api/users');
    await metricsExample.trackDatabaseQuery('SELECT', 'users');
    await metricsExample.trackBusinessAction('create', 'users');

    // 使用自定义指标
    customMetrics.trackCustomEvent('user_login', 'user123');
    customMetrics.setCustomValue('active_users', 150);

    const customTimer = customMetrics.trackCustomOperation('data_processing');
    // 模拟处理时间
    await new Promise((resolve) => setTimeout(resolve, 100));
    customTimer();

    // 获取指标数据
    const metricsData = await utils.getMetrics();
    console.log('Prometheus metrics:', metricsData);
  } catch (error) {
    metricsExample.trackError('application', error as Error);
  } finally {
    // 停止系统指标收集
    systemCollector.stop();
  }
}
