import { AppTelemetryOptions } from '@tachybase/server';

export const telemetry: AppTelemetryOptions = {
  enabled: process.env.TELEMETRY_ENABLED === 'on',
  metric: {
    readerName: process.env.TELEMETRY_METRIC_READER,
  },
  trace: {
    processorName: process.env.TELEMETRY_TRACE_PROCESSOR,
  },
};
