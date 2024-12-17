import { register } from "tsx/esm/api";
import { workerData } from "worker_threads";

register();

if(workerData.scriptPath){
  await import(workerData.scriptPath);
}