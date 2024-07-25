import { PrometheusExporter, PrometheusSerializer } from '@opentelemetry/exporter-prometheus';

export class InternalPrometheusExporter extends PrometheusExporter {
  constructor(app) {
    super({
      preventServerStart: true,
    });
    app.resourcer.define({
      name: 'prometheus',
      actions: {
        metrics: async (ctx) => {
          ctx.withoutDataWrapping = true;
          ctx.set('Content-Type', 'text/plain');
          ctx.res.statusCode = 200;
          try {
            const collectionRes = await this.collect();
            const { resourceMetrics, errors } = collectionRes;
            if (errors.length) {
              ctx.log.error(`metrics collection errors`, {
                method: 'InternalPrometheusExporter',
                errors,
              });
            }
            ctx.body = new PrometheusSerializer().serialize(resourceMetrics);
          } catch (err) {
            ctx.body = `# failed to export metrics: ${err}`;
          }
        },
      },
    });
  }
  collect() {
    return super.collect();
  }
}
