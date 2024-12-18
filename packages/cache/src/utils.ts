/**
 * 通用的错误重试函数
 * @param operation - 要执行的异步操作函数
 * @param options - 配置选项，包括方法名字、最大重试次数、初始延迟、延迟倍数等
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  {
    name,
    retry = 10,
    startingDelay = 50,
    timeMultiple = 2,
  }: { name: string; retry?: number; startingDelay?: number; timeMultiple?: number },
): Promise<T> {
  let attemptNumber = 1;

  // 执行重试操作
  while (attemptNumber <= retry) {
    try {
      // 执行操作
      const result = await operation();
      console.log(`${name} success!`);
      return result; // 成功则返回结果
    } catch (error) {
      // 记录日志
      console.warn(`Attempt ${name} ${attemptNumber}/${retry}: ${error.message}`);

      // 如果已超过最大重试次数，抛出错误
      if (attemptNumber === retry) {
        console.error(`${name} failed after ${retry} attempts.`);
        throw error; // 超过重试次数，抛出最后一次错误
      }

      // 等待指定时间后再重试
      const nextDelay = startingDelay * Math.pow(timeMultiple, attemptNumber - 1);
      console.warn(`Retrying ${name} in ${nextDelay}ms...`);

      // 增加延迟后再进行重试
      await new Promise((resolve) => setTimeout(resolve, nextDelay));

      attemptNumber++; // 增加重试次数
    }
  }

  // 如果循环结束，还没有成功，抛出最终错误
  throw new Error(`${name} failed after ${retry} attempts`);
}
