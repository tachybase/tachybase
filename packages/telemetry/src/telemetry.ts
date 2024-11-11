import { getNodeAutoInstrumentations } from '@tachybase/opentelemetry-auto-instrumentations';

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { InstrumentationOption, registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// TODO: 需要更改为更合适的取主版本的方法
import packageJson from '../package.json'; // 防止加载什么奇怪的东西
import { telemetryOptions } from './config';
import { Metric, MetricOptions } from './metric';
import { Trace, TraceOptions } from './trace';

export { telemetryOptions };

export interface TelemetryOptions {
  serviceName?: string;
  version?: string;
  trace?: TraceOptions;
  metric?: MetricOptions;
}

export interface AppTelemetryOptions extends TelemetryOptions {
  enabled?: boolean;
}

export class Telemetry {
  serviceName: string;
  version: string;
  instrumentations: InstrumentationOption[] = [];
  trace: Trace;
  metric: Metric;
  started = false;

  constructor(options?: TelemetryOptions) {
    const { trace, metric, serviceName, version } = options || {};
    this.serviceName = serviceName || 'tachybase-main';
    this.version = version || '';
    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.version,
      }),
    );
    this.trace = new Trace({ tracerName: `${serviceName}-trace`, version, ...trace, resource });
    this.metric = new Metric({ meterName: `${serviceName}-meter`, version, ...metric, resource });
  }

  init() {
    console.log(`Start init telemetry service ${this.serviceName}@${this.version}`);

    // 设置 OTel 日志等级
    const diagLogLevel = process.env.OTEL_LOG_LEVEL;
    if (diagLogLevel) {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel[diagLogLevel]);
    }

    // 自动插桩
    try {
      const instrumentations = getNodeAutoInstrumentations();
      this.addInstrumentation(instrumentations);
      console.log(
        `auto-instrumentations added, num: ${instrumentations.length}, names: ${instrumentations.map((i) => i.instrumentationName.replace('@opentelemetry/instrumentation-', '') + '@' + i.instrumentationVersion).join(', ')}`,
      );
    } catch (error) {
      console.error('Failed to add auto-instrumentations:', error);
    }

    registerInstrumentations({
      instrumentations: this.instrumentations,
    });

    this.trace.init();
    this.metric.init();
  }

  start() {
    if (!this.started) {
      this.trace.start();
      this.metric.start();
    }
    this.started = true;
  }

  /**
   * 关闭链路追踪和指标监控, NOTE: 一旦调用此方法，将无法再次启动，需要重新实例化
   * @returns
   * @memberof Telemetry
   */
  async shutdown() {
    await Promise.all([this.trace.shutdown(), this.metric.shutdown()]);
    this.started = false;
  }

  addInstrumentation(...instrumentation: InstrumentationOption[]) {
    this.instrumentations.push(...instrumentation);
  }
}

let _telemetry: Telemetry;

let serviceName = process.env.TELEMETRY_SERVICE_NAME;
if (!serviceName) {
  if (telemetryOptions.enabled) {
    console.warn('TELEMETRY_SERVICE_NAME is not set, will use default service name, please set it in .env file!');
  }
  serviceName = `tachybase-main`;
}

export const getTelemetry = () => {
  if (!_telemetry || typeof _telemetry === 'undefined') {
    _telemetry = new Telemetry({
      serviceName,
      version: packageJson.version || 'UnkVer',
      ...telemetryOptions,
    });
    if (telemetryOptions.enabled) {
      _telemetry.init();
    }
  }
  // 这里只需要 init，start 保留在 application 里

  return _telemetry;
};
