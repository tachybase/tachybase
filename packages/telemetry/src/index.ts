import { getTelemetry } from './telemetry';

if (!getTelemetry()) {
  throw new Error('Failed to load telemetry');
}

export * from './telemetry';
