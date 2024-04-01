import { readFile, readdir, stat, writeFile } from "fs/promises";
import { join } from "path";

const deps = [];

const directoryPath = "./packages"; // 替换成你的目录路径

function isDirectoryExcluded(dirname) {
  return dirname === "node_modules"; // 排除 node_modules 目录
}

async function replaceInPackageJson(filePath) {
  try {
    const data = await readFile(filePath, "utf8");
    const pkg = JSON.parse(data);
    for (let key of ['devDependencies', 'dependencies']) {
      if (key in pkg) {
        for (let name in pkg[key]) {
          deps.push({
            name,
            version: pkg[key][name],
          });
        }
      }
    }
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

async function traverseDirectory(currentPath) {
  try {
    const files = await readdir(currentPath);
    for (let file of files) {
      const filePath = join(currentPath, file);
      const stats = await stat(filePath);
      if (stats.isDirectory() && !isDirectoryExcluded(file)) {
        await traverseDirectory(filePath);
      } else if (stats.isFile() && file === "package.json") {
        await replaceInPackageJson(filePath);
      }
    }
  } catch (err) {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
  }
}

await traverseDirectory(directoryPath);

// 排序
deps.sort((a, b) => a.name < b.name ? -1 : 1)

const dequeDeps = []
dequeDeps.push(deps[0]);
deps.forEach(dep => {
  const lastDep = dequeDeps[dequeDeps.length - 1];
  if (lastDep.name === dep.name && lastDep.version === dep.version) {
    return;
  }
  dequeDeps.push(dep);
});


for (let dep of deps) {
  console.log(JSON.stringify({[dep.name]: dep.version}))
}

const data = await readFile('./dev-error.log', "utf-8");

const lines = data.split('\n')

for (let line of lines) {
  if (line.startsWith('error')) {
    continue;
  }
  const result = line.match(/ '([^']*)' in/);
  const result2 = line.match(/packages\/plugins\/([^/]*\/[^/]*)\//)

  if (result && result2) {
    const dep = result[1];

    const pkg = dequeDeps.find(pkg => pkg.name === dep)
    if (!pkg) {
      console.warn(dep + ' is not found');
      continue
    }
    const path = `packages/plugins/${result2[1]}/package.json`
    const pkgContent = JSON.parse(await readFile(path, "utf-8"));
    console.log(dep, pkg.version, path);
    if ('devDependencies' in pkgContent) {
      pkgContent['devDependencies'][dep] = pkg.version;
    } else if ('dependencies' in pkgContent){
      pkgContent['dependencies'][dep] = pkg.version;
    } else {
      pkgContent['devDependencies'] = { [dep]: pkg.version };
    }
    await writeFile(path, JSON.stringify(pkgContent, null, 2), 'utf8')
  }
}
