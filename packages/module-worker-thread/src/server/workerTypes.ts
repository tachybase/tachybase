import { Plugin } from '@tachybase/server';

export enum WorkerEvent {
  Started = 'started',
  PluginMethod = 'PluginMethod',
}

export type WorkerEventInputDefault = {
  // 超时时长,默认为300秒
  timeoutSecond?: number;
  // 同时运行的最大数量,默认不限制, 比如下载大表的plugin@method, 可以限制同时运行的数量为1
  limit?: number;
};

export type WorkerEventInputPluginMethod<T = any> = WorkerEventInputDefault & {
  plugin: typeof Plugin | string;
  method: string;
  params: T;
};

export type WorkerEventInput = WorkerEventInputPluginMethod;
