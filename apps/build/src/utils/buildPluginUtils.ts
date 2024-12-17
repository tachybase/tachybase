import fs from 'fs';
import { builtinModules } from 'module';
import path from 'path';

import chalk from 'chalk';

const requireRegex = /require\s*\(['"`](.*?)['"`]\)/g;
const importRegex = /^import(?:['"\s]*([\w*${}\s,]+)from\s*)?['"\s]['"\s](.*[@\w_-]+)['"\s].*/gm;

type Log = (msg: string, ...args: any) => void;

export function isNotBuiltinModule(packageName: string) {
  return !builtinModules.includes(packageName);
}

export const isValidPackageName = (str: string) => {
  const pattern = /^(?:@[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_-]+$/;
  return pattern.test(str);
};

/**
 * get package name from string
 * @example
 * getPackageNameFromString('lodash') => lodash
 * getPackageNameFromString('lodash/xx') => lodash
 * getPackageNameFromString('@aa/bb') => @aa/bb
 * getPackageNameFromString('aa/${lang}') => aa
 *
 * getPackageNameFromString('./xx') => null
 * getPackageNameFromString('../xx') => null
 * getPackageNameFromString($file) => null
 * getPackageNameFromString(`${file}`) => null
 * getPackageNameFromString($file + './xx') => null
 */
export function getPackageNameFromString(str: string) {
  // ./xx or ../xx
  if (str.startsWith('.')) return null;

  const arr = str.split('/');
  let packageName: string;
  if (arr[0].startsWith('@')) {
    // @aa/bb/ccFile => @aa/bb
    packageName = arr.slice(0, 2).join('/');
  } else {
    // aa/bbFile => aa
    packageName = arr[0];
  }

  packageName = packageName.trim();

  return isValidPackageName(packageName) ? packageName : null;
}

export function getPackagesFromFiles(files: string[]): string[] {
  const packageNames = files
    .map((item) => [
      ...[...item.matchAll(importRegex)].map((item) => item[2]),
      ...[...item.matchAll(requireRegex)].map((item) => item[1]),
    ])
    .flat()
    .map(getPackageNameFromString)
    .filter(Boolean)
    .filter(isNotBuiltinModule);

  return [...new Set(packageNames)];
}

export function getSourcePackages(fileSources: string[]): string[] {
  return getPackagesFromFiles(fileSources);
}

export function getIncludePackages(sourcePackages: string[], external: string[], pluginPrefix: string[]): string[] {
  return sourcePackages
    .filter((packageName) => !external.includes(packageName)) // exclude external
    .filter((packageName) => !pluginPrefix.some((prefix) => packageName.startsWith(prefix))); // exclude other plugin
}

export function getExcludePackages(sourcePackages: string[], external: string[], pluginPrefix: string[]): string[] {
  const includePackages = getIncludePackages(sourcePackages, external, pluginPrefix);
  return sourcePackages.filter((packageName) => !includePackages.includes(packageName));
}

export function getPackageJsonPackages(packageJson: Record<string, any>): string[] {
  return [
    ...new Set([...Object.keys(packageJson.devDependencies || {}), ...Object.keys(packageJson.dependencies || {})]),
  ];
}

export function checkEntryExists(cwd: string, entry: 'server' | 'client', log: Log) {
  const srcDir = path.join(cwd, 'src', entry);
  if (!fs.existsSync(srcDir)) {
    log('Missing %s. Please create it.', chalk.red(`src/${entry}`));
    process.exit(-1);
  }

  return srcDir;
}

export function checkDependencies(packageJson: Record<string, any>, log: Log) {}

type CheckOptions = {
  cwd: string;
  log: Log;
  entry: 'server' | 'client';
  files: string[];
  packageJson: Record<string, any>;
};

export function getFileSize(filePath: string) {
  const stat = fs.statSync(filePath);
  return stat.size;
}

export function formatFileSize(fileSize: number) {
  const kb = fileSize / 1024;
  return kb.toFixed(2) + ' KB';
}

export function buildCheck(options: CheckOptions) {
  const { cwd, log, entry, files, packageJson } = options;
  checkEntryExists(cwd, entry, log);

  // checkRequirePackageJson(files, log);
  checkDependencies(packageJson, log);
}

export function checkRequire(sourceFiles: string[], log: Log) {
  const requireArr = sourceFiles
    .map((filePath) => {
      const code = fs.readFileSync(filePath, 'utf-8');
      return [...code.matchAll(requireRegex)].map((item) => ({
        filePath: filePath,
        code: item[0],
      }));
    })
    .flat();
  if (requireArr.length) {
    log('%s not allowed. Please use %s instead.', chalk.red('require()'), chalk.red('import'));
    requireArr.forEach((item, index) => {
      console.log('%s. %s in %s;', index + 1, chalk.red(item.code), chalk.red(item.filePath));
    });
    console.log('\n');
    process.exit(-1);
  }
}

export function checkFileSize(outDir: string, log: Log) {
  const files = fs.readdirSync(outDir);

  files.forEach((file) => {
    const fileSize = getFileSize(path.join(outDir, file));
    if (fileSize > 1024 * 1024) {
      log(
        `The %s size %s exceeds 1MB. You can use dynamic import \`import()\` for lazy loading content.`,
        chalk.red(file),
        chalk.red(formatFileSize(fileSize)),
      );
    }
  });
}
