import path from 'path';

import fs from 'fs-extra';

export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replace(/\\/g, '/');
}

/**
 * get relative externals for specific pre-bundle pkg from other pre-bundle deps
 * @note  for example, "compiled/a" can be externalized in "compiled/b" as "../a"
 */
export function getRltExternalsFromDeps(
  depExternals: Record<string, string>,
  current: { name: string; outputDir: string },
) {
  return Object.entries(depExternals).reduce<Record<string, string>>((r, [dep, target]) => {
    // skip self
    if (dep !== current.name) {
      // transform dep externals path to relative path
      r[dep] = winPath(path.relative(current.outputDir, path.dirname(target)));
    }

    return r;
  }, {});
}

function findPackageJson(filePath) {
  const directory = path.dirname(filePath);
  const packageJsonPath = path.resolve(directory, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    return directory; // 返回找到的 package.json 所在目录
    // FIXME 这个在 windows 上应该跑不了
  } else if (directory !== '/') {
    // 递归寻找直到根目录
    return findPackageJson(directory);
  } else {
    throw new Error('package.json not found.');
  }
}

/**
 * get package.json path for specific NPM package
 */
export function getDepPkgPath(dep: string, cwd: string) {
  try {
    return require.resolve(`${dep}/package.json`, { paths: [cwd] });
  } catch {
    const mainFile = require.resolve(`${dep}`, { paths: cwd ? [cwd] : undefined });
    const packageDir = mainFile.slice(0, mainFile.indexOf(dep.replace('/', path.sep)) + dep.length);
    const result = path.join(packageDir, 'package.json');
    if (!fs.existsSync(result)) {
      return path.join(findPackageJson(mainFile), 'package.json');
    }
    return result;
  }
}

interface IDepPkg {
  nccConfig: {
    minify: boolean;
    target: string;
    quiet: boolean;
    externals: Record<string, string>;
  };
  depDir: string;
  pkg: Record<string, any>;
  outputDir: string;
  mainFile: string;
}

export function getDepsConfig(cwd: string, outDir: string, depsName: string[], external: string[]) {
  const pkgExternals: Record<string, string> = external.reduce((r, dep) => ({ ...r, [dep]: dep }), {});

  const depExternals = {};
  const deps = depsName.reduce<Record<string, IDepPkg>>((acc, packageName) => {
    const depEntryPath = require.resolve(packageName, { paths: [cwd] });
    const depPkgPath = getDepPkgPath(packageName, cwd);
    const depPkg = require(depPkgPath);
    const depDir = path.dirname(depPkgPath);
    const outputDir = path.join(outDir, packageName);
    const mainFile = path.join(outputDir, depEntryPath.replace(depDir, ''));
    acc[depEntryPath] = {
      nccConfig: {
        minify: true,
        target: 'es5',
        quiet: true,
        externals: {},
      },
      depDir,
      pkg: depPkg,
      outputDir,
      mainFile,
    };

    return acc;
  }, {});

  // process externals for deps
  Object.values(deps).forEach((depConfig) => {
    const rltDepExternals = getRltExternalsFromDeps(depExternals, {
      name: depConfig.pkg.name!,
      outputDir: depConfig.outputDir,
    });

    depConfig.nccConfig.externals = {
      ...pkgExternals,
      ...rltDepExternals,
    };
  });

  return deps;
}
