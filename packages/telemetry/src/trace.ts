import { Registry } from '@tachybase/utils';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor, ConsoleSpanExporter, SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

export type TraceOptions = {
  tracerName?: string;
  version?: string;
  processorName?: string | string[];
  resource?: Resource;
};

type GetSpanProcessor = () => SpanProcessor;

export class Trace {
  processorName: string | string[];
  processors = new Registry<GetSpanProcessor>();
  tracerName: string;
  version: string;
  provider: NodeTracerProvider;

  constructor(options?: TraceOptions) {
    const { processorName, tracerName, version, resource } = options || {};
    this.processorName = processorName || 'console';
    this.tracerName = tracerName || 'tachybase-trace';
    this.version = version || '';
    this.provider = new NodeTracerProvider({
      resource,
    });
    this.provider.register();
  }

  init() {
    this.registerProcessor('console', () => new BatchSpanProcessor(new ConsoleSpanExporter()));
    // 初始化 OTLP 作为链路追踪 Processor
    const newOtlpExporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_GRPC || 'http://localhost:4317',
    });
    // NOTE: 开发时可替换 BatchSpanProcessor 为 SimpleSpanProcessor 以便监测数据实时上传，区别详见
    // https://opentelemetry.io/docs/languages/js/instrumentation/#picking-the-right-span-processor
    this.registerProcessor('otlp', () => new BatchSpanProcessor(newOtlpExporter));
  }

  registerProcessor(name: string, processor: GetSpanProcessor) {
    console.log('register trace processor:', name);
    this.processors.register(name, processor);
  }

  getProcessor(name: string) {
    return this.processors.get(name);
  }

  getTracer(name?: string, version?: string) {
    return this.provider.getTracer(name || this.tracerName, version || this.version);
  }

  start() {
    let processorName = this.processorName;
    if (typeof processorName === 'string') {
      processorName = processorName.split(',');
    }
    processorName.forEach((name) => {
      const processor = this.getProcessor(name)();
      this.provider.addSpanProcessor(processor);
    });

    // 创建链路追踪的 span，自动插桩的 span 才能正常 work，我也不知道为什么，别删就对了
    const tracer = this.getTracer();
    const span = tracer.startSpan('load');
    span.setAttribute('event', 'load');
    span.addEvent('load');
    span.end();
  }

  shutdown() {
    return this.provider.shutdown();
  }
}
