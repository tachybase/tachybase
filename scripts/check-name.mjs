import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';

// 查找指定路径下的所有文件夹名称，并获取其中的 package.json 文件
async function findFoldersAndPackageJson(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const result = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderPath = path.join(dirPath, entry.name);
        const packageJsonPath = path.join(folderPath, 'package.json');

        // 检查是否有 package.json 文件
        try {
          await fs.stat(packageJsonPath); // 试图读取 package.json
          result.push({
            folder: entry.name,
            packageJson: 'package.json', // 你可以返回更详细的信息，如果需要
          });
        } catch (err) {
          // 如果没有 package.json 文件，忽略
        }
      }
    }

    return result;
  } catch (err) {
    console.error('读取目录失败:', err);
    return [];
  }
}

const dirPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../packages'); // 指定要查找的目录路径
findFoldersAndPackageJson(dirPath).then((folders) => {
  console.log('找到的文件夹及其 package.json 文件:', folders);
});
