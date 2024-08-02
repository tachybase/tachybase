import { Registry } from '@tachybase/utils';

import opentelemetry from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import {
  ConsoleMetricExporter,
  MeterProvider,
  MetricReader,
  PeriodicExportingMetricReader,
  View,
} from '@opentelemetry/sdk-metrics';

import initMeters from './meters';

export type MetricOptions = {
  meterName?: string;
  version?: string;
  readerName?: string | string[];
};

type GetMetricReader = () => MetricReader;

export class Metric {
  meterName: string;
  version: string;
  readerName: string | string[];
  readers = new Registry<GetMetricReader>();
  provider: MeterProvider;
  views: View[] = [];

  constructor(options?: MetricOptions) {
    const { meterName, readerName, version } = options || {};
    this.readerName = readerName || 'console';
    this.meterName = meterName || 'tachybase-meter';
    this.version = version || '';
    this.registerReader(
      'console',
      () =>
        new PeriodicExportingMetricReader({
          exporter: new ConsoleMetricExporter(),
        }),
    );
  }

  init(resource: Resource) {
    this.provider = new MeterProvider({ resource, views: this.views });
    opentelemetry.metrics.setGlobalMeterProvider(this.provider);
  }

  registerReader(name: string, reader: GetMetricReader) {
    console.log('register metric reader:', name);
    this.readers.register(name, reader);
  }

  getReader(name: string) {
    return this.readers.get(name);
  }

  addView(...view: View[]) {
    this.views.push(...view);
  }

  getMeter(name?: string, version?: string) {
    return this.provider.getMeter(name || this.meterName, version || this.version);
  }

  start() {
    // 创建 Prometheus 作为指标 Reader
    try {
      // 启动 Prometheus 服务器
      const startServer = process.env.OTEL_PROMETHEUS_SERVER === 'on';
      if (!startServer) {
        console.warn('Prometheus server is disabled');
      } else {
        const port = Number(process.env.OTEL_PROMETHEUS_PORT) || 9464;
        if (port <= 0 || port >= 65536) {
          throw new Error(`Invalid port: ${port}`);
        }
        if (port <= 1024) {
          console.warn('Prometheus server will try to run on a privileged port, it may need root permission');
        }
        if (port === 9464) {
          console.warn('Prometheus server will run on default port 9464');
        }
        try {
          // 启动 Prometheus Exporter
          const reader = () =>
            new PrometheusExporter(
              {
                port,
              },
              () => {
                console.log(`Prometheus exporter endpoint started on http://localhost:${port}/metrics`);
              },
            );
          // 注册 Prometheus Exporter 作为指标 Reader
          this.registerReader('prometheus', reader);
        } catch (error) {
          console.error('Failed to initialize Prometheus metrics reader:', error);
        }
      }
    } catch (error) {
      console.error('Failed to initialize Prometheus metrics reader:', error);
    }

    // 添加指标 Reader
    let readerName = this.readerName;
    if (typeof readerName === 'string') {
      readerName = readerName.split(',');
    }
    readerName.forEach((name) => {
      const reader = this.getReader(name)();
      this.provider.addMetricReader(reader);
    });

    // 初始化指标 Meters
    try {
      const meter = this.getMeter();
      const meters = new initMeters(meter);
      meters
        .start()
        .then(() => {
          console.log('Meters initialized');
        })
        .catch((error) => {
          console.error('Failed to initialize meters:', error);
        });
    } catch (error) {
      console.error('Failed to initialize meters:', error);
    }
  }

  shutdown() {
    return this.provider.shutdown();
  }
}
