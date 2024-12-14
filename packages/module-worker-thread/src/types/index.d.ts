import { WorkerManager } from '../server/workerManager';

declare module '@tachybase/server' {
  interface Application {
    worker: WorkerManager;
    workerPlugins: Set<string>;
    /**
     * 尽量不要在 子应用|定时任务|工作流 中调用工作线程
     * @param plugin
     * @returns
     */
    registerWorker: (plugin: string) => void;
  }
}
