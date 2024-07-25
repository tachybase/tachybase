import { Plugin } from '@tachybase/server';

import initMeters from './meters';
import { InternalPrometheusExporter, PrometheusExporter } from './prometheus-exporters';

export class PluginPrometheusServer extends Plugin {
  async afterAdd() {
    this.app.on('beforeLoad', async (app) => {
      const startServer = process.env.TELEMETRY_PROMETHEUS_SERVER === 'on';
      let reader;
      if (!startServer) {
        reader = () => new InternalPrometheusExporter(app);
        this.log.info('internal prometheus endpoint registered on /api/prometheus:metrics');
      } else {
        const port: number = Number(process.env.TELEMETRY_PROMETHEUS_PORT) || 9464;
        reader = () =>
          new PrometheusExporter(
            {
              port, // optional - default is 9464
            },
            () => {
              this.log.info(`independent prometheus endpoint started on http://localhost:${port}/metrics`);
            },
          );
      }
      app.telemetry.metric.registerReader('prometheus', reader);
    });
  }

  async beforeLoad() {}

  async load() {
    const meter = this.app.telemetry.metric.getMeter();
    const meters = new initMeters(meter);
    await meters.start();
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginPrometheusServer;
