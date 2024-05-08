import type { Project } from '@pnpm/workspace.find-packages';
import path from 'path';

export const globExcludeFiles = [
  '!src/**/__tests__',
  '!src/**/__test__',
  '!src/**/__e2e__',
  '!src/**/demos',
  '!src/**/fixtures',
  '!src/**/*.mdx',
  '!src/**/*.md',
  '!src/**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)',
];
export const EsbuildSupportExts = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.css',
  '.less',
  '.sass',
  '.scss',
  '.styl',
  '.txt',
  '.data',
];
export const ROOT_PATH = path.join(__dirname, '../../../../');
export const NODE_MODULES = path.join(ROOT_PATH, 'node_modules');
export const PACKAGES_PATH = path.join(ROOT_PATH, 'packages');
export const PLUGINS_DIR = ['plugins', 'samples', 'pro-plugins']
  .concat((process.env.PLUGINS_DIRS || '').split(','))
  .filter(Boolean)
  .map((name) => path.join(PACKAGES_PATH, name));
export const PRESETS_DIR = path.join(PACKAGES_PATH, 'presets');
export const getPluginPackages = (packages: Project[]) =>
  packages.filter((item) => PLUGINS_DIR.some((pluginDir) => item.dir.startsWith(pluginDir)));
export const getPresetsPackages = (packages: Project[]) => packages.filter((item) => item.dir.startsWith(PRESETS_DIR));
export const CORE_APP = path.join(PACKAGES_PATH, 'core/app');
export const CORE_CLIENT = path.join(PACKAGES_PATH, 'core/client');
export const ESM_PACKAGES = ['@tachybase/test'];
export const CJS_EXCLUDE_PACKAGES = [
  path.join(PACKAGES_PATH, 'core/build'),
  path.join(PACKAGES_PATH, 'core/cli'),
  CORE_CLIENT,
];
export const getCjsPackages = (packages: Project[]) =>
  packages
    .filter((item) => !PLUGINS_DIR.some((dir) => item.dir.startsWith(dir)))
    .filter((item) => !item.dir.startsWith(PRESETS_DIR))
    .filter((item) => !CJS_EXCLUDE_PACKAGES.includes(item.dir));

// tar
export const tarIncludesFiles = ['package.json', 'README.md', 'LICENSE', 'dist', '!node_modules', '!src'];
export const TAR_OUTPUT_DIR = process.env.TAR_PATH ? process.env.TAR_PATH : path.join(ROOT_PATH, 'storage', 'tar');
