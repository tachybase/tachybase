const { dirname, resolve } = require('path');
const { readdir, symlink, unlink, mkdir, stat } = require('fs').promises;

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

async function fsExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    return false;
  }
}

exports.fsExists = fsExists;

async function createStoragePluginSymLink(pluginName) {
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

exports.createStoragePluginSymLink = createStoragePluginSymLink;

async function createStoragePluginsSymlink() {
  const storagePluginsPath = resolve(process.cwd(), 'storage/plugins');
  if (!(await fsExists(storagePluginsPath))) {
    return;
  }
  const pluginNames = await getStoragePluginNames(storagePluginsPath);
  await Promise.all(pluginNames.map((pluginName) => createStoragePluginSymLink(pluginName)));
}

exports.createStoragePluginsSymlink = createStoragePluginsSymlink;

async function createDevPluginSymLink(pluginName, dir) {
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
      console.log('===', pluginName);
      await unlink(link);
    }
    await symlink(resolve(packagePluginsPath, pluginName), link, 'dir');
  } catch (error) {
    // console.error(error);
  }
}

exports.createDevPluginSymLink = createDevPluginSymLink;

async function createDevPluginsSymlink() {
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

exports.createDevPluginsSymlink = createDevPluginsSymlink;
