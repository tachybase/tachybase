import { APIClient, Application } from '@tachybase/client';

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
    this.app.apiClient.resource('instrumentation').create({
      values: {
        ...data,
      },
    });
  }
}
