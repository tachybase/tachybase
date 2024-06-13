import path from 'path';

import Topo from '@hapi/topo';
import { findWorkspacePackages, type Project } from '@pnpm/workspace.find-packages';
import fg from 'fast-glob';

import { PACKAGES_PATH, ROOT_PATH } from '../constant';
import { toUnixPath } from './utils';

/**
 * 获取构建包的绝对路径，支持项目路径和 npm 两种形式
 * @example
 * pnpm build packages/core/client @tachybase/acl => ['/home/xx/packages/core/client', '/home/xx/packages/core/acl']
 * pnpm build packages/plugins/* => ['/home/xx/packages/plugins/a', '/home/xx/packages/plugins/b']
 * pnpm build => all packages
 */
function getPackagesPath(pkgs: string[]) {
  const allPackageJson = fg.sync(['*/*/package.json', '*/*/*/package.json'], {
    cwd: PACKAGES_PATH,
    absolute: true,
    onlyFiles: true,
  });

  if (pkgs.length === 0) {
    return allPackageJson.map(toUnixPath).map((item) => path.dirname(item));
  }
  const allPackageInfo = allPackageJson
    .map((packageJsonPath) => ({
      name: require(packageJsonPath).name,
      path: path.dirname(toUnixPath(packageJsonPath)),
    }))
    .reduce((acc, cur) => {
      acc[cur.name] = cur.path;
      return acc;
    }, {});
  const allPackagePaths: string[] = Object.values(allPackageInfo);

  const pkgNames = pkgs.filter((item) => allPackageInfo[item]);
  const relativePaths = pkgNames.length ? pkgs.filter((item) => !pkgNames.includes(item)) : pkgs;
  const pkgPaths = pkgs.map((item) => allPackageInfo[item]);
  const absPaths = allPackagePaths.filter((absPath) =>
    relativePaths.some((relativePath) => absPath.endsWith(relativePath)),
  );
  const dirPaths = fg.sync(pkgs, { onlyDirectories: true, absolute: true, cwd: ROOT_PATH });
  const dirMatchPaths = allPackagePaths.filter((pkgPath) => dirPaths.some((dirPath) => pkgPath.startsWith(dirPath)));
  return [...new Set([...pkgPaths, ...absPaths, ...dirMatchPaths])];
}

export async function getPackages(pkgs: string[]) {
  const packagePaths = getPackagesPath(pkgs);

  const allProjects = await findWorkspacePackages(ROOT_PATH, {
    supportedArchitectures: {
      os: ['current'],
      cpu: ['current'],
      libc: ['current'],
    },
  });

  const packages = allProjects.filter((pkg) => packagePaths.includes(toUnixPath(pkg.dir)));

  return sortPackages(packages);
}

// make sure the order of packages is correct
export function sortPackages(packages: Project[]): Project[] {
  const sorter = new Topo.Sorter<Project>();
  for (const pkg of packages) {
    const pkgJson = require(`${pkg.dir}/package.json`);
    const after = Object.keys({ ...pkgJson.dependencies, ...pkgJson.devDependencies, ...pkgJson.peerDependencies });
    sorter.add(pkg, { after, group: pkg.manifest.name });
  }
  return sorter.nodes;
}
