import { Application } from '.';
import { APIClient } from '../api-client';

export interface TrackingData {
  type: string;
  key: string;
  values?: Record<string, any>;
}

export class TrackingManager {
  api: APIClient;
  constructor(private app: Application) {}

  async logEvent(type: string, key: string, values?: Record<string, any>) {
    const data: TrackingData = {
      type,
      key,
      values,
    };
    this.api.resource('instrumentation').create({
      values: {
        ...data,
      },
    });
  }
}
