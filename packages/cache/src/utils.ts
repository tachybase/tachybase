interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

/**
 * Generic retry function for async operations
 * @param operation - Async operation to execute
 * @param options - Configuration options including operation name, max retries, initial delay, and delay multiplier
 * @returns {Promise<T>} - Returns the result of the successful operation
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  {
    name,
    retry = 10,
    startingDelay = 50,
    timeMultiple = 2,
    timeout = 5000,
    logger = {
      info: console.log,
      warn: console.warn,
      error: console.error,
    },
  }: {
    name: string;
    retry?: number;
    startingDelay?: number;
    timeMultiple?: number;
    timeout?: number;
    logger?: Logger
  },
): Promise<T> {
  let attemptNumber = 1;

  // 执行重试操作
  while (attemptNumber <= retry) {
    try {
      // 执行操作
      const result = await Promise.race([
        operation(),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`${name} operation timeout`)), 5000)),
      ]);
      logger.info(`${name} success!`);
      return result[0]; // 成功则返回结果
    } catch (error) {
      // 记录日志
      logger.warn(`Attempt ${name} ${attemptNumber}/${retry}: ${error.message}`);

      // 如果已超过最大重试次数，抛出错误
      if (attemptNumber === retry) {
        logger.error(`${name} failed after ${retry} attempts.`);
        throw error; // 超过重试次数，抛出最后一次错误
      }

      // 等待指定时间后再重试
      const nextDelay = startingDelay * Math.pow(timeMultiple, attemptNumber - 1);
      logger.warn(`Retrying ${name} in ${nextDelay}ms...`);

      // 增加延迟后再进行重试
      await new Promise((resolve) => setTimeout(resolve, nextDelay));

      attemptNumber++; // 增加重试次数
    }
  }

  // 如果循环结束，还没有成功，抛出最终错误
  throw new Error(`${name} failed after ${retry} attempts`);
}
