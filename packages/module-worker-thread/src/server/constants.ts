export const WORKER_COUNT_INIT = process.env.WORKER_COUNT ? +process.env.WORKER_COUNT : 1;
export const WORKER_COUNT_MAX = process.env.WORKER_COUNT_MAX ? +process.env.WORKER_COUNT_MAX : 8;
// in second
export const WORKER_TIMEOUT = process.env.WORKER_TIMEOUT ? +process.env.WORKER_TIMEOUT : 1800;
export const WORKER_ERROR_RETRY = process.env.WORKER_ERROR_RETRY ? +process.env.WORKER_ERROR_RETRY : 3;

export const WORKER_COUNT_INIT_SUB = process.env.WORKER_COUNT_INIT_SUB ? +process.env.WORKER_COUNT_INIT_SUB : 0;
