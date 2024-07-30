import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { InstrumentationOption, registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { Metric, MetricOptions } from './metric';
import { Trace, TraceOptions } from './trace';

export interface TelemetryOptions {
  serviceName?: string;
  version?: string;
  trace?: TraceOptions;
  metric?: MetricOptions;
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
    this.trace = new Trace({ tracerName: `${serviceName}-trace`, version, ...trace });
    this.metric = new Metric({ meterName: `${serviceName}-meter`, version, ...metric });
    this.serviceName = serviceName || 'tachybase';
    this.version = version || '';
  }

  init() {
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

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.version,
      }),
    );

    this.trace.init(resource);
    this.metric.init(resource);
  }

  start() {
    if (!this.started) {
      this.trace.start();
      this.metric.start();
    }
    this.started = true;
  }

  async shutdown() {
    await Promise.all([this.trace.shutdown(), this.metric.shutdown()]);
    this.started = false;
  }

  addInstrumentation(...instrumentation: InstrumentationOption[]) {
    this.instrumentations.push(...instrumentation);
  }
}
