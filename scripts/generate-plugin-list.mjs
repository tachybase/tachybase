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
  console.log('📁 Created output directory:', outputDir);
}

// 获取插件信息的函数
function getPluginInfo(dir) {
  const pkgPath = path.join(pluginsRoot, dir, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    console.warn(`⚠️ No package.json found in ${dir}`);
    return null;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    // 只处理 @tachybase/plugin- 开头的插件
    if (!pkg.name || !pkg.name.startsWith('@tachybase/plugin-')) {
      return null;
    }

    return {
      name: pkg.name,
      displayName: pkg['displayName.zh-CN'] || pkg.displayName || dir,
      description: pkg['description.zh-CN'] || pkg.description || '',
      version: pkg.version || 'unknown',
      dir: dir
    };
  } catch (error) {
    console.error(`❌ Error reading package.json in ${dir}:`, error.message);
    return null;
  }
}

// 获取所有插件目录
function getAllPluginDirs() {
  try {
    return fs
      .readdirSync(pluginsRoot)
      .filter((dir) => {
        const fullPath = path.join(pluginsRoot, dir);
        return fs.statSync(fullPath).isDirectory();
      });
  } catch (error) {
    console.error('❌ Error reading packages directory:', error.message);
    return [];
  }
}

// 生成插件列表内容
function generatePluginList() {
  console.log('🔍 Scanning for plugins...');

  const pluginDirs = getAllPluginDirs();
  console.log(`📦 Found ${pluginDirs.length} directories in packages/`);

  const plugins = pluginDirs
    .map(getPluginInfo)
    .filter((plugin) => plugin !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      return a.name.localeCompare(b.name);
    });

  console.log(`✅ Found ${plugins.length} valid plugins`);

  let content = '# 插件列表\n\n';
  content += '| 序号 | 插件名 | 插件中文名 | 描述 | 版本 |\n';
  content += '| --- | --- | --- | --- | --- |\n';

  plugins.forEach((plugin, index) => {
    if (!plugin) return;
    const description = plugin.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    content += `| ${index + 1} | \`${plugin.name}\` | ${plugin.displayName} | ${description} | ${plugin.version} |\n`;
  });

  // 添加统计信息
  content += '\n## 统计信息\n\n';
  content += `- **总插件数量**: ${plugins.length}\n`;
  content += `- **最后更新时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`;
  content += `- **生成来源**: tachybase/tachybase 仓库\n`;

  return content;
}

// 主函数
function main() {
  try {
    console.log('🚀 Starting plugin list generation...');
    console.log('📂 Plugins root:', pluginsRoot);
    console.log('📄 Output file:', outputFile);

    const content = generatePluginList();

    fs.writeFileSync(outputFile, content, 'utf-8');

    const stats = fs.statSync(outputFile);
    console.log('✅ Plugin list generated successfully!');
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📝 Lines: ${content.split('\n').length}`);
    console.log('📄 Output file:', outputFile);

  } catch (error) {
    console.error('❌ Error generating plugin list:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
