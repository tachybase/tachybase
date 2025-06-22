import { readFileSync } from 'node:fs';
import { mkdir, readdir, symlink, unlink } from 'node:fs/promises';
import path, { join, resolve } from 'node:path';

import { fsExists } from './fs-exists';

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

export async function createStoragePluginSymLink(pluginName) {}

export async function createStoragePluginsSymlink() {
  const storagePluginsPath = resolve(process.cwd(), 'storage/plugins');
  if (!(await fsExists(storagePluginsPath))) {
    return;
  }
  const pluginNames = await getStoragePluginNames(storagePluginsPath);
  await Promise.all(pluginNames.map((pluginName) => createStoragePluginSymLink(pluginName)));
}

export async function createDevPluginSymLink(pluginName: string) {}

export async function createDevPluginsSymlink() {
  const storagePluginsPath = resolve(process.cwd(), 'packages');
  if (!(await fsExists(storagePluginsPath))) {
    return;
  }
  const pluginNames = await getStoragePluginNames(storagePluginsPath);
  await Promise.all(
    pluginNames
      .filter((pluginName: string) => pluginName.startsWith('plugin-') || pluginName.startsWith('module-'))
      .map((pluginName) => createDevPluginSymLink(pluginName)),
  );
}
