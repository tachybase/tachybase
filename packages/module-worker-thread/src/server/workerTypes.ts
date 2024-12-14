export enum WorkerEvent {
  Started = 'started',
  PluginMethod = 'PluginMethod',
}

export type WorkerEventInputDefault = {
  // 超时时长,默认为300秒
  timeoutSecond?: number;
};

export type WorkerEventInputPluginMethod<T = any> = WorkerEventInputDefault & {
  plugin: string;
  method: string;
  params: T;
};

export type WorkerEventInput = WorkerEventInputPluginMethod;
