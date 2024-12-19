import { WorkerManager } from '../server/workerManager';

declare module '@tachybase/server' {
  interface Application {
    worker: WorkerManager;
  }
}
