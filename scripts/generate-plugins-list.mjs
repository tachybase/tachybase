import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginsRoot = path.resolve(__dirname, '../packages');

const outputFile = path.resolve(__dirname, '../docs-dist/plugin-list.md');

// 确保输出目录存在
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let content = '# 插件列表\n\n | 序号 | 插件名 | 插件中文名 | 描述 |\n| --- | --- | --- | --- |\n';

// 获取所有插件目录, 只获取 @tachybase/plugin- 开头的插件
const pluginDirs = fs
  .readdirSync(pluginsRoot)
  .filter((dir) => fs.statSync(path.join(pluginsRoot, dir)).isDirectory())
  .filter((dir) => {
    const pkgPath = path.join(pluginsRoot, dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      return pkg.name && pkg.name.startsWith('@tachybase/plugin-');
    }
    return false;
  });


for (let i = 0; i < pluginDirs.length; i++) {
  const dir = pluginDirs[i];
  const pkgPath = path.join(pluginsRoot, dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    content += `| ${i + 1} | ${pkg['name'] || dir} | ${pkg['displayName.zh-CN'] || dir} | ${pkg['description.zh-CN'] || ''} |\n`;
  }
}

fs.writeFileSync(outputFile, content, 'utf-8');
console.log('插件列表生成完毕:', outputFile);
