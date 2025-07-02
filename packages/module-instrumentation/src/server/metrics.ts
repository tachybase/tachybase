import client from 'prom-client';

// 创建 Prometheus 注册表
const register = new client.Registry();

// 添加默认指标收集器
client.collectDefaultMetrics({
  register,
});

// 定义指标类型
export interface MetricsConfig {
  prefix?: string;
  labels?: string[];
}

// 计数器 - 用于统计事件发生次数
export class Counter {
  private counter: client.Counter;

  constructor(name: string, help: string, config: MetricsConfig = {}) {
    const { prefix = 'tachybase', labels = [] } = config;
    this.counter = new client.Counter({
      name: `${prefix}_${name}`,
      help,
      labelNames: labels,
      registers: [register],
    });
  }

  increment(labels?: Record<string, string | number>, value: number = 1) {
    this.counter.inc(labels, value);
  }

  reset() {
    this.counter.reset();
  }
}

// 仪表盘 - 用于统计当前值
export class Gauge {
  private gauge: client.Gauge;

  constructor(name: string, help: string, config: MetricsConfig = {}) {
    const { prefix = 'tachybase', labels = [] } = config;
    this.gauge = new client.Gauge({
      name: `${prefix}_${name}`,
      help,
      labelNames: labels,
      registers: [register],
    });
  }

  set(value: number, labels?: Record<string, string | number>) {
    this.gauge.set(labels, value);
  }

  increment(labels?: Record<string, string | number>, value: number = 1) {
    this.gauge.inc(labels, value);
  }

  decrement(labels?: Record<string, string | number>, value: number = 1) {
    this.gauge.dec(labels, value);
  }

  reset() {
    this.gauge.reset();
  }
}

// 直方图 - 用于统计分布情况
export class Histogram {
  private histogram: client.Histogram;

  constructor(name: string, help: string, config: MetricsConfig & { buckets?: number[] } = {}) {
    const { prefix = 'tachybase', labels = [], buckets } = config;
    this.histogram = new client.Histogram({
      name: `${prefix}_${name}`,
      help,
      labelNames: labels,
      buckets: buckets || [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300, 600],
      registers: [register],
    });
  }

  observe(value: number, labels?: Record<string, string | number>) {
    this.histogram.observe(labels, value);
  }

  startTimer(labels?: Record<string, string | number>) {
    return this.histogram.startTimer(labels);
  }

  reset() {
    this.histogram.reset();
  }
}

// 摘要 - 用于统计分位数
export class Summary {
  private summary: client.Summary;

  constructor(name: string, help: string, config: MetricsConfig & { percentiles?: number[] } = {}) {
    const { prefix = 'tachybase', labels = [], percentiles } = config;
    this.summary = new client.Summary({
      name: `${prefix}_${name}`,
      help,
      labelNames: labels,
      percentiles: percentiles || [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999],
      registers: [register],
    });
  }

  observe(value: number, labels?: Record<string, string | number>) {
    this.summary.observe(labels, value);
  }

  startTimer(labels?: Record<string, string | number>) {
    return this.summary.startTimer(labels);
  }

  reset() {
    this.summary.reset();
  }
}

// 预定义的常用指标
export const metrics = {
  // HTTP 请求相关指标
  http: {
    requestsTotal: new Counter('http_requests_total', 'Total number of HTTP requests', {
      labels: ['method', 'path', 'status_code', 'app'],
    }),
    requestDuration: new Histogram('http_request_duration_seconds', 'HTTP request duration in seconds', {
      labels: ['method', 'path', 'app'],
    }),
    activeConnections: new Gauge('http_active_connections', 'Number of active HTTP connections', {
      labels: ['app'],
    }),
  },

  // 数据库相关指标
  database: {
    queriesTotal: new Counter('database_queries_total', 'Total number of database queries', {
      labels: ['operation', 'table', 'app'],
    }),
    queryDuration: new Histogram('database_query_duration_seconds', 'Database query duration in seconds', {
      labels: ['operation', 'table', 'app'],
    }),
    connections: new Gauge('database_connections', 'Number of database connections', {
      labels: ['state', 'app'],
    }),
    errors: new Counter('database_errors_total', 'Total number of database errors', {
      labels: ['operation', 'table', 'app'],
    }),
  },

  // 业务逻辑相关指标
  business: {
    actionsTotal: new Counter('business_actions_total', 'Total number of business actions', {
      labels: ['action', 'collection', 'app'],
    }),
    actionDuration: new Histogram('business_action_duration_seconds', 'Business action duration in seconds', {
      labels: ['action', 'collection', 'app'],
    }),
    recordsCreated: new Counter('business_records_created_total', 'Total number of records created', {
      labels: ['collection', 'app'],
    }),
    recordsUpdated: new Counter('business_records_updated_total', 'Total number of records updated', {
      labels: ['collection', 'app'],
    }),
    recordsDeleted: new Counter('business_records_deleted_total', 'Total number of records deleted', {
      labels: ['collection', 'app'],
    }),
  },

  // 系统资源相关指标
  system: {
    memoryUsage: new Gauge('system_memory_usage_bytes', 'Memory usage in bytes', {
      labels: ['type', 'app'],
    }),
    cpuUsage: new Gauge('system_cpu_usage_percent', 'CPU usage percentage', {
      labels: ['app'],
    }),
    diskUsage: new Gauge('system_disk_usage_bytes', 'Disk usage in bytes', {
      labels: ['path', 'app'],
    }),
  },

  // 缓存相关指标
  cache: {
    hits: new Counter('cache_hits_total', 'Total number of cache hits', {
      labels: ['cache_name', 'app'],
    }),
    misses: new Counter('cache_misses_total', 'Total number of cache misses', {
      labels: ['cache_name', 'app'],
    }),
    size: new Gauge('cache_size', 'Current cache size', {
      labels: ['cache_name', 'app'],
    }),
  },

  // 错误相关指标
  errors: {
    total: new Counter('errors_total', 'Total number of errors', {
      labels: ['type', 'app'],
    }),
    rate: new Gauge('errors_rate', 'Error rate per second', {
      labels: ['type', 'app'],
    }),
  },
};

// 工具函数
export const utils = {
  // 获取指标数据
  async getMetrics(): Promise<string> {
    return await register.metrics();
  },

  // 获取 JSON 格式的指标数据
  async getMetricsAsJSON(): Promise<any> {
    return await register.getMetricsAsJSON();
  },

  // 重置所有指标
  resetAllMetrics(): void {
    register.clear();
  },

  // 创建带标签的指标记录器
  createLabeledMetrics(app: string, collection?: string) {
    return {
      http: {
        requestsTotal: (method: string, path: string, statusCode: number) =>
          metrics.http.requestsTotal.increment({ method, path, status_code: statusCode.toString(), app }),
        requestDuration: (method: string, path: string) =>
          metrics.http.requestDuration.startTimer({ method, path, app }),
        activeConnections: (count: number) => metrics.http.activeConnections.set(count, { app }),
      },
      database: {
        queriesTotal: (operation: string, table: string) =>
          metrics.database.queriesTotal.increment({ operation, table, app }),
        queryDuration: (operation: string, table: string) =>
          metrics.database.queryDuration.startTimer({ operation, table, app }),
        connections: (state: string, count: number) => metrics.database.connections.set(count, { state, app }),
        errors: (operation: string, table: string) => metrics.database.errors.increment({ operation, table, app }),
      },
      business: {
        actionsTotal: (action: string, collectionName: string = collection || 'unknown') =>
          metrics.business.actionsTotal.increment({ action, collection: collectionName, app }),
        actionDuration: (action: string, collectionName: string = collection || 'unknown') =>
          metrics.business.actionDuration.startTimer({ action, collection: collectionName, app }),
        recordsCreated: (collectionName: string = collection || 'unknown') =>
          metrics.business.recordsCreated.increment({ collection: collectionName, app }),
        recordsUpdated: (collectionName: string = collection || 'unknown') =>
          metrics.business.recordsUpdated.increment({ collection: collectionName, app }),
        recordsDeleted: (collectionName: string = collection || 'unknown') =>
          metrics.business.recordsDeleted.increment({ collection: collectionName, app }),
      },
      system: {
        memoryUsage: (type: string, bytes: number) => metrics.system.memoryUsage.set(bytes, { type, app }),
        cpuUsage: (percent: number) => metrics.system.cpuUsage.set(percent, { app }),
        diskUsage: (path: string, bytes: number) => metrics.system.diskUsage.set(bytes, { path, app }),
      },
      cache: {
        hits: (cacheName: string) => metrics.cache.hits.increment({ cache_name: cacheName, app }),
        misses: (cacheName: string) => metrics.cache.misses.increment({ cache_name: cacheName, app }),
        size: (cacheName: string, size: number) => metrics.cache.size.set(size, { cache_name: cacheName, app }),
      },
      errors: {
        total: (type: string) => metrics.errors.total.increment({ type, app }),
        rate: (type: string, rate: number) => metrics.errors.rate.set(rate, { type, app }),
      },
    };
  },
};

// 导出注册表
export { register };

// 默认导出
export default {
  Counter,
  Gauge,
  Histogram,
  Summary,
  metrics,
  utils,
  register,
};
