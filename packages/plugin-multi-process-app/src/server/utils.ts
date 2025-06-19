import { exec, execSync, spawn } from 'child_process';

/**
 * 同步执行 Shell 命令
 * @param command 要执行的完整命令字符串
 * @param cwd 运行命令的目录
 */
export function runCommand(command: string, cwd?: string): void {
  try {
    console.log(`执行命令: ${command} (目录: ${cwd || '当前目录'})`);
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`命令执行失败: ${command}`, (error as Error).message);
    process.exit(1);
  }
}

/**
 * 异步执行 Shell 命令，返回进程 PID
 * @param command 命令名称（例如 "pnpm"）
 * @param args 命令参数（例如 ["start", "--quickstart"]）
 * @param cwd 运行命令的目录
 * @param env 自定义环境变量
 * @returns Promise<number> 返回进程的 PID
 */
export function runCommandAsync(
  command: string,
  args: string[],
  cwd?: string,
  env?: Record<string, string>,
): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log(`启动进程: ${command} ${args.join(' ')} (目录: ${cwd || '当前目录'})`);

    // 合并 process.env 和用户传入的 env
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env }, // 继承系统环境变量并合并用户传入的变量
    });

    console.log(`进程 PID: ${child.pid}`);

    child.on('error', (error) => {
      console.error(`进程启动失败: ${error.message}`);
      reject(error);
    });

    child.on('exit', (code) => {
      console.log(`进程退出，代码: ${code}`);
      resolve(code ?? -1);
    });

    resolve(child.pid ?? -1);
  });
}

/**
 * 根据端口号查找进程 PID
 * @param port 端口号
 * @returns Promise<number | null> 返回 PID（如果找到）
 */
export function getPidByPort(port: number): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const platform = process.platform;

    let command = '';
    if (platform === 'win32') {
      command = `netstat -ano | findstr :${port}`;
    } else {
      command = `lsof -i :${port} | grep LISTEN`;
    }

    exec(command, (error, stdout) => {
      if (error) {
        return resolve(null);
      }

      const lines = stdout.split('\n').filter(Boolean);
      if (lines.length === 0) {
        return resolve(null); // 没有找到进程
      }

      let pid: number | null = null;
      if (platform === 'win32') {
        const match = lines[0].trim().split(/\s+/).pop();
        if (match) {
          pid = parseInt(match, 10);
        }
      } else {
        const match = lines[0].trim().split(/\s+/)[1];
        if (match) {
          pid = parseInt(match, 10);
        }
      }

      resolve(pid || null);
    });
  });
}
