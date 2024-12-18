import { randomUUID } from 'crypto';
import path from 'path';
import { isMainThread, Worker } from 'worker_threads';
import { Application } from '@tachybase/server';

import { WORKER_COUNT_INIT, WORKER_ERROR_RETRY, WORKER_TIMEOUT } from './constants';
import { WorkerEvent, WorkerEventInput, WorkerEventInputPluginMethod } from './workerTypes';

type callPluginMethodInfo = {
  lastTime: Date;
  count: number;
};

// 工作线程尽量不要在定时任务和工作流(工作流的ctx,通知等等出问题)中使用
export class WorkerManager {
  public get available() {
    return this.workerList.length > 0;
  }

  private isDev = true;

  private workerNum = WORKER_COUNT_INIT;
  private workerList: Worker[] = [];

  private currentWorkerIndex = 0;
  private busyWorkers = new WeakMap<Worker, Set<string>>();
  private busyWorkerSet: Set<Worker> = new Set();
  private workerPlugins: string[] = [];
  private cache = new Map<string, callPluginMethodInfo>();
  private errorRecoveryTimes = 0;

  // 默认超时时间
  private static readonly timeoutSecond = WORKER_TIMEOUT;

  private getPluginMethodKey(values: WorkerEventInputPluginMethod) {
    return `worker:pluginMethod:${values.plugin}:${values.method}`;
  }

  constructor(
    public app: Application,
    isDev: boolean,
    workerNum?: number,
  ) {
    if (!isMainThread) {
      return;
    }
    this.isDev = isDev;
    if (workerNum) {
      this.workerNum = workerNum;
    }
    this.workerPlugins = [...this.app.workerPlugins];
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
    await Promise.all(Array.from({ length: this.workerNum }).map(() => this.addWorker()));
  }

  private async addWorker() {
    let worker: Worker;
    if (!this.isDev) {
      worker = new Worker(path.resolve(__dirname, './worker.js'), {
        workerData: {
          plugins: this.workerPlugins,
        },
      });
    } else {
      worker = new Worker(path.resolve(__dirname, '../../worker-starter.mjs'), {
        workerData: {
          scriptPath: path.resolve(__dirname, './worker.ts'),
          plugins: this.workerPlugins,
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
    this.workerPlugins = [];
    this.cache = new Map<string, callPluginMethodInfo>();
    this.errorRecoveryTimes = 0;
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
   * 运行插件方法
   */
  public async callPluginMethod(values: WorkerEventInputPluginMethod) {
    let countInfo: callPluginMethodInfo = null;
    if (values.limit) {
      const key = this.getPluginMethodKey(values);
      countInfo = this.cache.get(key);
      if (countInfo && countInfo.lastTime) {
        const diff = new Date().getTime() - countInfo.lastTime.getTime();
        if (diff > 1000 * WorkerManager.timeoutSecond) {
          countInfo.count = 0;
        }
      }
      if (countInfo && countInfo.count >= values.limit) {
        throw new Error('Plugin method call limit exceeded');
      } else {
        if (!countInfo) {
          countInfo = {
            lastTime: new Date(),
            count: 1,
          };
        } else {
          countInfo.lastTime = new Date();
          countInfo.count++;
        }
        this.cache.set(key, countInfo);
      }
    }
    const result = await this.callMethod(WorkerEvent.PluginMethod, {
      ...values,
      plugin: this.app.pm.get(values.plugin).name,
    });
    if (values.limit) {
      const key = this.getPluginMethodKey(values);
      countInfo = this.cache.get(key);
      if (countInfo) {
        countInfo.count--;
        if (countInfo.count < 0) {
          this.cache.delete(key);
        } else {
          countInfo.lastTime = new Date();
          this.cache.set(key, countInfo);
        }
      }
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
          this.handleWorkerCompletion(worker, reqId, resolve, message.result);
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
