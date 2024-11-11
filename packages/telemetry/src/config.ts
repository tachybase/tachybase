export const telemetryOptions = {
  enabled: process.env.TELEMETRY_ENABLED === 'on' && process.env.APP_ENV === 'production',
  metric: {
    readerName: process.env.OTEL_METRICS_READER,
  },
  trace: {
    processorName: process.env.OTEL_TRACES_PROCESSOR,
  },
};
