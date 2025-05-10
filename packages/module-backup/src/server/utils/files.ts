import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'path';

/**
 * 清理指定目录中旧的 .tbdump 文件，仅保留最新的 maxNumber 个文件
 * @param dirPath 目标目录路径
 * @param maxNumber 要保留的最新文件数量
 */
export async function cleanOldFiles(dirPath: string, maxNumber: number) {
  // 1. 读取目录中的所有条目
  const names = await readdir(dirPath);

  // 2. 过滤出以 .tbdump 结尾的文件，并排除目录
  const files = await Promise.all(
    names.map(async (name) => {
      const filePath = path.join(dirPath, name);
      try {
        const info = await stat(filePath);
        // 检查是否为文件且扩展名为 .tbdump
        if (info.isFile() && path.extname(name) === '.tbdump') {
          return { name, mtime: info.mtime };
        }
      } catch (err) {
        // 忽略无法访问的文件
        return null;
      }
      return null;
    }),
  );

  // 3. 移除 null 值并按修改时间降序排序（最新的在前）
  const validFiles = files.filter(Boolean) as { name: string; mtime: Date }[];
  validFiles.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  // 4. 获取需要删除的旧文件列表
  const toDelete = validFiles.slice(maxNumber).map((f) => f.name);

  // 5. 删除旧文件
  await Promise.all(toDelete.map((name) => unlink(path.join(dirPath, name))));
}
