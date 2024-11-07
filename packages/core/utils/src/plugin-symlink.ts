import { mkdir, readdir, symlink, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

import { fsExists } from './fs-exists';

const dirs = ['plugins', 'plugins-auth', 'plugins-action', 'plugins-field', 'plugins-experiments'];

async function getStoragePluginNames(target) {
  const plugins = [];
  const items = await readdir(target);
  for (const item of items) {
    if (item.startsWith('@')) {
      const children = await getStoragePluginNames(resolve(target, item));
      plugins.push(
        ...children.map((child) => {
          return `${item}/${child}`;
        }),
      );
    } else if (await fsExists(resolve(target, item, 'package.json'))) {
      plugins.push(item);
    }
  }
  return plugins;
}

export async function createStoragePluginSymLink(pluginName) {
  const storagePluginsPath = resolve(process.cwd(), 'storage/plugins');
  const nodeModulesPath = process.env.NODE_MODULES_PATH;
  try {
    if (pluginName.startsWith('@')) {
      const [orgName] = pluginName.split('/');
      if (!(await fsExists(resolve(nodeModulesPath, orgName)))) {
        await mkdir(resolve(nodeModulesPath, orgName), { recursive: true });
      }
    }
    const link = resolve(nodeModulesPath, pluginName);
    if (await fsExists(link)) {
      await unlink(link);
    }
    await symlink(resolve(storagePluginsPath, pluginName), link, 'dir');
  } catch (error) {
    console.error(error);
  }
}

export async function createStoragePluginsSymlink() {
  const storagePluginsPath = resolve(process.cwd(), 'storage/plugins');
  if (!(await fsExists(storagePluginsPath))) {
    return;
  }
  const pluginNames = await getStoragePluginNames(storagePluginsPath);
  await Promise.all(pluginNames.map((pluginName) => createStoragePluginSymLink(pluginName)));
}

export async function createDevPluginSymLink(pluginName, dir) {
  const packagePluginsPath = resolve(process.cwd(), 'packages/' + dir);
  const nodeModulesPath = process.env.NODE_MODULES_PATH;
  try {
    if (pluginName.startsWith('@')) {
      const [orgName] = pluginName.split('/');
      if (!(await fsExists(resolve(nodeModulesPath, orgName)))) {
        await mkdir(resolve(nodeModulesPath, orgName), { recursive: true });
      }
    }
    const link = resolve(nodeModulesPath, pluginName);
    if (await fsExists(link)) {
      await unlink(link);
    }
    await symlink(resolve(packagePluginsPath, pluginName), link, 'dir');
  } catch (error) {
    console.error(error);
  }
}

export async function createDevPluginsSymlink() {
  const pluginNames = [];
  for (const dir of dirs) {
    const storagePluginsPath = resolve(process.cwd(), 'packages/' + dir);
    if (!(await fsExists(storagePluginsPath))) {
      return;
    }
    pluginNames.push(...[...(await getStoragePluginNames(storagePluginsPath))].map((name) => [name, dir]));
  }
  await Promise.all(pluginNames.map(([pluginName, dir]) => createDevPluginSymLink(pluginName, dir)));
}
