import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义 packages 目录
const packagesDir = path.resolve(__dirname, "../packages");

async function updatePackageJson() {
  try {
    // 读取 packages 目录下的所有子目录
    const dirs = await fs.readdir(packagesDir, { withFileTypes: true });

    for (const dir of dirs) {
      if (dir.isDirectory()) {
        const packageJsonPath = path.join(packagesDir, dir.name, "package.json");

        try {
          // 读取并解析 package.json
          const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
          const packageName = packageJson.name;

          if (!packageName) {
            console.warn(`No name found in ${packageJsonPath}, skipping...`);
            continue;
          }

          // 修改 scripts.build
          packageJson.scripts = packageJson.scripts || {};
          packageJson.scripts.build = `tachybase-build --no-dts ${packageName}`;

          // 写回修改后的 package.json
          await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
          console.log(`Updated: ${packageJsonPath}`);
        } catch (error) {
          console.error(`Failed to process ${dir.name}:`, error);
        }
      }
    }
  } catch (err) {
    console.error("Error reading directories:", err);
  }
}

updatePackageJson();
