export const WORKER_COUNT = process.env.WORKER_COUNT ? +process.env.WORKER_COUNT : 1;
export const WORKER_COUNT_MAX = process.env.WORKER_COUNT_MAX ? +process.env.WORKER_COUNT_MAX : 8;
// in second
export const WORKER_TIMEOUT = process.env.WORKER_TIMEOUT ? +process.env.WORKER_TIMEOUT : 1800;
export const WORKER_ERROR_RETRY = process.env.WORKER_ERROR_RETRY ? +process.env.WORKER_ERROR_RETRY : 3;
// sub account init worker count, default 0
export const WORKER_COUNT_SUB = process.env.WORKER_COUNT_SUB ? +process.env.WORKER_COUNT_SUB : 0;
