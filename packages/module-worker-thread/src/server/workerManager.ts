import { randomUUID } from 'crypto';
import path from 'path';
import { isMainThread, Worker } from 'worker_threads';
import { Application } from '@tachybase/server';
import { fsExists } from '@tachybase/utils';

import { WORKER_ERROR_RETRY, WORKER_FILE, WORKER_TIMEOUT } from './constants';
import { callPluginMethodInfo, WorkerEvent, WorkerEventInput, WorkerEventInputPluginMethod } from './workerTypes';

/**
 * 从对象中提取基本类型的值,只提取一层的基本类型值
 * @param obj - 输入对象
 * @returns 只包含基本类型值的新对象
 */
function copyBasicTypes(obj: any): any {
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        result[key] = value;
      }
    }
  }
  return result;
}

// 工作线程尽量不要在定时任务和工作流(工作流的ctx,通知等等出问题)中使用
export class WorkerManager {
  public get available() {
    return this.workerList.length > 0;
  }

  private isProd = true;

  private workerNum = 0;
  private workerList: Worker[] = [];

  private currentWorkerIndex = 0;
  private busyWorkers = new WeakMap<Worker, Set<string>>();
  private busyWorkerSet: Set<Worker> = new Set();
  private cache = new Map<string, callPluginMethodInfo>();
  private errorRecoveryTimes = 0;

  // 默认超时时间
  private static readonly timeoutSecond = WORKER_TIMEOUT;

  private getPluginMethodKey(values: WorkerEventInputPluginMethod) {
    return `worker:pluginMethod:${values.plugin}:${values.method}`;
  }
  private getGlobalKey() {
    return `worker:global`;
  }

  private databaseOptions;

  constructor(
    public app: Application,
    workerNum?: number,
  ) {
    if (!isMainThread) {
      return;
    }
    if (workerNum !== undefined) {
      this.workerNum = workerNum;
    }

    this.databaseOptions = copyBasicTypes(app.db.options);
  }

  public getPresetWorkerNum() {
    return this.workerNum;
  }

  public getCurrentWorkerNum() {
    return this.workerList.length;
  }

  public getBusyWorkerNum() {
    return this.busyWorkerSet.size;
  }

  public async initWorkers() {
    if (!isMainThread) {
      return;
    }
    // FIXME: 这种判断方式不太优雅
    this.isProd = await fsExists(path.resolve(__dirname, `${WORKER_FILE}.js`));
    await Promise.all(Array.from({ length: this.workerNum }).map(() => this.addWorker()));
  }

  private async addWorker() {
    let worker: Worker;
    if (this.isProd) {
      worker = new Worker(path.resolve(__dirname, `${WORKER_FILE}.js`), {
        workerData: {
          appName: this.app.name,
          databaseOptions: this.databaseOptions,
        },
      });
    } else {
      worker = new Worker(path.resolve(__dirname, '../../worker-starter.mjs'), {
        workerData: {
          scriptPath: path.resolve(__dirname, `${WORKER_FILE}.ts`),
          appName: this.app.name,
          databaseOptions: this.databaseOptions,
        },
      });
    }

    await new Promise<void>((resolve, reject) => {
      worker.on('message', (message) => {
        if (message.event === 'started') {
          this.workerList.push(worker);
          resolve();
        }
      });

      worker.on('error', (error) => {
        reject(error);
      });

      worker.on('exit', async (code) => {
        if (code === 0 || code === 1) {
          return;
        }
        this.errorRecoveryTimes++;
        this.app.logger.error(`Worker stopped with exit code ${code}, times: ${this.errorRecoveryTimes}`);
        if (this.errorRecoveryTimes >= WORKER_ERROR_RETRY) {
          this.app.logger.error(`Worker error for ${this.errorRecoveryTimes} times`);
          return;
        }
        this.workerList = this.workerList.filter((w) => w !== worker);
        if (this.workerList.length < this.workerNum) {
          await this.addWorker();
        }
        this.errorRecoveryTimes = 0;
      });
    });
  }

  public async clear() {
    if (!isMainThread) {
      return;
    }
    await Promise.all(this.workerList.map((worker) => worker.terminate()));
    this.workerList = [];
    this.workerNum = 0;

    this.currentWorkerIndex = 0;
    this.busyWorkers = new WeakMap<Worker, Set<string>>();
    this.busyWorkerSet = new Set();
    this.errorRecoveryTimes = 0;
    this.cache.clear();
  }

  public async resetWorkerNum(targetNum: number) {
    if (!isMainThread) {
      return;
    }
    this.workerNum = targetNum;
    if (targetNum < this.workerList.length) {
      const excessWorkers = this.workerList.length - targetNum;
      let terminatedCount = 0;
      for (let i = this.workerList.length - 1; i >= 0 && terminatedCount < excessWorkers; i--) {
        const worker = this.workerList[i];
        if (!this.busyWorkers.get(worker)?.size) {
          this.workerList.splice(i, 1);
          worker.terminate();
          terminatedCount++;
        }
      }
    } else if (targetNum > this.workerList.length) {
      const additionalWorkers = targetNum - this.workerList.length;
      for (let i = 0; i < additionalWorkers; i++) {
        this.addWorker();
      }
    }
  }

  /**
   * 检查并更新并发计数
   * @param key - 用于缓存的键
   * @param limit - 并发限制
   * @param cache - 缓存对象
   * @returns 是否超过并发限制
   */
  private checkAndUpdateConcurrency(key: string, limit: number, cache: Map<string, callPluginMethodInfo>): boolean {
    const now = Date.now();
    let countInfo: callPluginMethodInfo = cache.get(key);
    if (countInfo && countInfo.lastTime) {
      const diff = now - countInfo.lastTime.getTime();
      if (diff > 1000 * WorkerManager.timeoutSecond) {
        countInfo.count = 0;
        this.app.logger.debug(`[worker] Reset concurrency count for ${key} due to timeout`);
      }
    }
    if (countInfo && countInfo.count >= limit) {
      this.app.logger.debug(`[worker] Concurrency limit reached for ${key}: ${countInfo.count}/${limit}`);
      return true;
    } else {
      if (!countInfo) {
        countInfo = {
          lastTime: new Date(now),
          count: 1,
        };
      } else {
        countInfo.lastTime = new Date(now);
        countInfo.count++;
      }
      cache.set(key, countInfo);
      return false;
    }
  }

  /**
   * 减少并发计数
   * @param key - 用于缓存的键
   * @param cache - 缓存对象
   */
  private decrementConcurrencyCount(key: string, cache: Map<string, callPluginMethodInfo>) {
    const countInfo = cache.get(key);
    if (countInfo) {
      countInfo.count--;
      if (countInfo.count < 0) {
        cache.delete(key);
      } else {
        countInfo.lastTime = new Date();
        cache.set(key, countInfo);
      }
    }
  }

  /**
   * 运行插件方法
   */
  public async callPluginMethod(values: WorkerEventInputPluginMethod) {
    // 处理全局并发
    if (values.globalConcurrency) {
      const exceeded = this.checkAndUpdateConcurrency(this.getGlobalKey(), values.globalConcurrency, this.cache);
      if (exceeded) {
        throw new Error('The system is currently processing other tasks. Please try again later');
      }
    }

    // 处理方法并发
    if (values.concurrency) {
      const exceeded = this.checkAndUpdateConcurrency(this.getPluginMethodKey(values), values.concurrency, this.cache);
      if (exceeded) {
        throw new Error('The system is currently processing other tasks. Please try again later');
      }
    }
    const result = await this.callMethod(WorkerEvent.PluginMethod, {
      ...values,
      plugin: this.app.pm.get(values.plugin).name,
    });

    // 处理全局并发
    if (values.globalConcurrency) {
      this.decrementConcurrencyCount(this.getGlobalKey(), this.cache);
    }

    // 处理方法并发
    if (values.concurrency) {
      this.decrementConcurrencyCount(this.getPluginMethodKey(values), this.cache);
    }
    return result;
  }

  private handleWorkerCompletion(
    worker: Worker,
    reqId: string,
    resolve: Function,
    result?: any,
    reject?: Function,
    error?: Error,
  ) {
    const busySet = this.busyWorkers.get(worker);
    if (busySet) {
      busySet.delete(reqId);
      if (!busySet.size) {
        this.busyWorkers.delete(worker);
        this.busyWorkerSet.delete(worker);
        if (this.workerList.length > this.workerNum) {
          this.workerList = this.workerList.filter((w) => w !== worker);
          worker.terminate();
        }
      }
    }
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  }

  /**
   * 运行通用方法
   */
  private async callMethod(workerEvent: WorkerEvent, values?: WorkerEventInput) {
    if (this.workerList.length === 0) {
      throw new Error('No available workers');
    }
    const reqId = randomUUID();
    if (this.currentWorkerIndex >= this.workerList.length) {
      this.currentWorkerIndex = 0;
    }
    const worker = this.workerList[this.currentWorkerIndex];
    this.currentWorkerIndex = (this.currentWorkerIndex + 1) % this.workerList.length;
    if (!this.busyWorkers.has(worker)) {
      this.busyWorkers.set(worker, new Set());
      this.busyWorkerSet.add(worker);
    }
    this.busyWorkers.get(worker).add(reqId);

    return new Promise((resolve, reject) => {
      let timeout;
      let handleMessage;
      let handleError;
      handleMessage = (message) => {
        if (message.reqId === reqId) {
          clearTimeout(timeout);
          worker.off('message', handleMessage);
          worker.off('error', handleError);
          this.handleWorkerCompletion(worker, reqId, resolve, message.result, reject, message.error);
        }
      };

      handleError = (error) => {
        clearTimeout(timeout);
        worker.off('message', handleMessage);
        worker.off('error', handleError);
        this.handleWorkerCompletion(worker, reqId, resolve, undefined, reject, error);
      };

      timeout = setTimeout(
        () => {
          worker.off('message', handleMessage);
          worker.off('error', handleError);
          this.handleWorkerCompletion(
            worker,
            reqId,
            resolve,
            undefined,
            reject,
            new Error('callPluginMethod timed out'),
          );
        },
        (values.timeoutSecond || WorkerManager.timeoutSecond) * 1000,
      );

      worker.on('message', handleMessage);
      worker.on('error', handleError);

      worker.postMessage({
        reqId,
        event: workerEvent,
        values,
      });
    });
  }
}
