import type { Constructor, Plugin } from '@tachybase/server';

export enum WorkerEvent {
  Started = 'started',
  PluginMethod = 'PluginMethod',
}

export type WorkerEventInputDefault = {
  // 超时时长,默认为300秒
  timeoutSecond?: number;
  // 方法同时运行的最大数量,默认不限制, 比如下载大表的plugin@method, 可以限制同时运行的数量为1
  concurrency?: number;
  // 所有方法同时运行的最大数量,默认不限制, 比如下载大表,备份数据库, 可以限制同时运行的数量为1
  globalConcurrency?: number;
};

export type WorkerEventInputPluginMethod<T = any> = WorkerEventInputDefault & {
  plugin: Constructor<Plugin> | string;
  method: string;
  params: T;
};

export type WorkerEventInput = WorkerEventInputPluginMethod;

export type WorkerWebInfo = {
  // 预设数量,个人页面设置>环境变量WORKER_COUNT
  preset: number;
  // 当前数量
  current: number;
  // 繁忙数量
  busy: number;
};

export type callPluginMethodInfo = {
  lastTime: Date;
  count: number;
};
