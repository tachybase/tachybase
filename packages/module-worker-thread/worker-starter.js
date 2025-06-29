const tsx = require('tsx/cjs/api');
const { workerData } = require('node:worker_threads');

tsx.register();

if (workerData.scriptPath) {
  require(workerData.scriptPath);
}
