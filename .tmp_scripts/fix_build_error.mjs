import { readFile, readdir, stat, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from 'url';

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

const filename = fileURLToPath(import.meta.url);
const curdir = dirname(filename);

const pkgs = [];

const data = await readFile(join(curdir, './build.2.log'), 'utf-8');
for (let line of data.split('\n')) {
  const result = line.match(/([^:]*): ([^ ]*) build start/)
  if (result) {
    const pkg = {
      name: result[1],
      dir: result[2],
      missings: [],
    };
    pkgs.push(pkg);
    console.log(JSON.stringify(pkg));
  }
  const moduleMatch = line.match(/Cannot find module '([^']*)'/)
  if (moduleMatch) {
    pkgs[pkgs.length - 1].missings.push(moduleMatch[1]);
  }
}

const notFound = [];

for (let pkg of pkgs) {
  // 处理 xx/yy/client 情况
  pkg.missings = pkg.missings.map((missing) =>
    missing.split('/').length === 3 && missing.endsWith('/client') ? missing.split('/').slice(0, 2).join('/') : missing,
  );
  pkg.missings = [...(new Set(pkg.missings))]
  // console.log(JSON.stringify(pkg));

  for (let dep of pkg.missings) {
    const foundDep = dequeDeps.find(pkg => pkg.name === dep)
    const path = join(curdir, `../packages/${pkg.dir}/package.json`)
    if (!foundDep) {
      console.warn(dep + ' is not found');
      notFound.push({ dep, path });
      continue
    }
    const pkgContent = JSON.parse(await readFile(path, "utf-8"));
    console.log(foundDep, foundDep.version, path);
    if ('peerDependencies' in pkgContent && (dep.startsWith('@nocobase/') || dep.startsWith('@hera/'))) {
      if (dep !== pkg.name) {
        pkgContent['peerDependencies'][dep] = 'workspace:*';
      }
    } else if ('devDependencies' in pkgContent) {
      pkgContent['devDependencies'][dep] = foundDep.version;
    } else if ('dependencies' in pkgContent){
      pkgContent['dependencies'][dep] = foundDep.version;
    } else {
      pkgContent['devDependencies'] = { [dep]: foundDep.version };
    }
    await writeFile(path, JSON.stringify(pkgContent, null, 2), 'utf8')
  }
}


console.log(notFound);
