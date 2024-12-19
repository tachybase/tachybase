const { existsSync } = require('fs');
const { resolve, sep } = require('path');
const packageJson = require('./package.json');
const fs = require('fs');
const glob = require('fast-glob');
const path = require('path');

console.log('VERSION: ', packageJson.version);

const ProjectRoot = path.join(__dirname, '../../');

function getUmiConfig() {
  const { APP_PORT, API_BASE_URL, APP_PUBLIC_PATH } = process.env;
  const API_BASE_PATH = process.env.API_BASE_PATH || '/api/';
  const EXTENSION_UI_BASE_PATH = process.env.EXTENSION_UI_BASE_PATH || '/adapters/';
  const PROXY_TARGET_URL = process.env.PROXY_TARGET_URL || `http://127.0.0.1:${APP_PORT}`;
  const LOCAL_STORAGE_BASE_URL = 'storage/uploads/';
  const STATIC_PATH = 'static/';

  function getLocalStorageProxy() {
    if (LOCAL_STORAGE_BASE_URL.startsWith('http')) {
      return {};
    }

    return {
      [APP_PUBLIC_PATH + LOCAL_STORAGE_BASE_URL]: {
        target: PROXY_TARGET_URL,
        changeOrigin: true,
      },
      [APP_PUBLIC_PATH + STATIC_PATH]: {
        target: PROXY_TARGET_URL,
        changeOrigin: true,
      },
    };
  }

  return {
    alias: getPackagePaths().reduce((memo, item) => {
      memo[item[0]] = item[1];
      return memo;
    }, {}),
    define: {
      'process.env.APP_PUBLIC_PATH': process.env.APP_PUBLIC_PATH,
      'process.env.WS_PATH': process.env.WS_PATH,
      'process.env.API_BASE_URL': API_BASE_URL || API_BASE_PATH,
      'process.env.APP_ENV': process.env.APP_ENV,
      'process.env.VERSION': packageJson.version,
      'process.env.WEBSOCKET_URL': process.env.WEBSOCKET_URL,
      'process.env.__E2E__': process.env.__E2E__,
    },
    // only proxy when using `umi dev`
    // if the assets are built, will not proxy
    proxy: {
      [API_BASE_PATH]: {
        target: PROXY_TARGET_URL,
        changeOrigin: true,
        pathRewrite: { [`^${API_BASE_PATH}`]: API_BASE_PATH },
      },
      [EXTENSION_UI_BASE_PATH]: {
        target: PROXY_TARGET_URL,
        changeOrigin: true,
        pathRewrite: { [`^${EXTENSION_UI_BASE_PATH}`]: EXTENSION_UI_BASE_PATH },
      },
      // for local storage
      ...getLocalStorageProxy(),
    },
  };
}

function getTsconfigPaths() {
  const content = fs.readFileSync(resolve(ProjectRoot, 'tsconfig.paths.json'), 'utf-8');
  const json = JSON.parse(content);
  return json.compilerOptions.paths;
}

function getPackagePaths() {
  const paths = getTsconfigPaths();
  const pkgs = [];
  for (const key in paths) {
    if (Object.hasOwnProperty.call(paths, key)) {
      for (let dir of paths[key]) {
        if (dir.includes('*')) {
          const files = glob.sync(dir, { cwd: ProjectRoot, onlyDirectories: true });
          for (const file of files) {
            const dirname = resolve(ProjectRoot, file);
            if (existsSync(dirname)) {
              const re = new RegExp(dir.replace('*', '(.+)'));
              const p = dirname
                .substring(ProjectRoot.length + 1)
                .split(sep)
                .join('/');
              const match = re.exec(p);
              pkgs.push([key.replace('*', match?.[1]), dirname]);
            }
          }
        } else {
          const dirname = resolve(ProjectRoot, dir);
          pkgs.push([key, dirname]);
        }
      }
    }
  }
  return pkgs;
}

function resolveTachybasePackagesAlias(config) {
  const pkgs = getPackagePaths();
  for (const [pkg, dir] of pkgs) {
    config.module.rules.get('ts-in-node_modules').include.add(dir);
    config.resolve.alias.set(pkg, dir);
  }
}

function getNodeModulesPath(packageDir) {
  const node_modules_dir = path.join(ProjectRoot, 'node_modules');
  return path.join(node_modules_dir, packageDir);
}
class IndexGenerator {
  tachybaseDir = getNodeModulesPath('@tachybase');

  constructor(outputPath, pluginsPath) {
    this.outputPath = outputPath;
    this.pluginsPath = pluginsPath;
  }

  get indexPath() {
    return path.join(this.outputPath, 'index.ts');
  }

  get packageMapPath() {
    return path.join(this.outputPath, 'packageMap.json');
  }

  get packagesPath() {
    return path.join(this.outputPath, 'packages');
  }

  generate(noIndex = false) {
    this.generatePluginContent(noIndex);
    if (process.env.NODE_ENV === 'production') return;
    this.pluginsPath.forEach((pluginPath) => {
      if (!fs.existsSync(pluginPath)) {
        return;
      }
      fs.watch(pluginPath, { recursive: false }, () => {
        this.generatePluginContent();
      });
    });
  }

  get indexContent() {
    return `// @ts-nocheck
import packageMap from './packageMap.json';

function devDynamicImport(packageName: string): Promise<any> {
  const fileName = packageMap[packageName];
  if (!fileName) {
    return Promise.resolve(null);
  }
  return import(\`./packages/\${fileName}\`)
}
export default devDynamicImport;`;
  }

  get emptyIndexContent() {
    return `
export default function devDynamicImport(packageName: string): Promise<any> {
  return Promise.resolve(null);
}`;
  }

  generatePluginContent(noIndex) {
    if (fs.existsSync(this.outputPath)) {
      fs.rmSync(this.outputPath, { recursive: true, force: true });
    }
    fs.mkdirSync(this.outputPath);
    const validPluginPaths = this.pluginsPath.filter((pluginsPath) => fs.existsSync(pluginsPath));
    if (!validPluginPaths.length || process.env.NODE_ENV === 'production') {
      fs.writeFileSync(this.indexPath, this.emptyIndexContent);
      return;
    }

    const pluginInfos = validPluginPaths.map((pluginsPath) => this.getContent(pluginsPath)).flat();

    // index.ts
    if (!noIndex) {
      fs.writeFileSync(this.indexPath, this.indexContent);
    }
    // packageMap.json
    const packageMapContent = pluginInfos.reduce((memo, item) => {
      memo[item.packageJsonName] = item.pluginFileName + '.ts';
      return memo;
    }, {});
    fs.writeFileSync(this.packageMapPath, JSON.stringify(packageMapContent, null, 2));
    // packages
    fs.mkdirSync(this.packagesPath, { recursive: true });
    pluginInfos.forEach((item) => {
      const pluginPackagePath = path.join(this.packagesPath, item.pluginFileName + '.ts');
      fs.writeFileSync(pluginPackagePath, item.exportStatement);
    });
  }

  getContent(pluginsPath) {
    const pluginFolders = glob.sync(['plugin-*/package.json', 'module-*/package.json', '*/*/package.json'], {
      cwd: pluginsPath,
      onlyFiles: true,
      absolute: true,
    });

    const storagePluginFolders = glob.sync(['*/package.json', '*/*/package.json'], {
      cwd: process.env.PLUGIN_STORAGE_PATH,
      onlyFiles: true,
      absolute: true,
    });

    const tachybasePluginFolders = glob
      .sync(['plugin-*/package.json'], { cwd: this.tachybaseDir, onlyFiles: true, absolute: true })
      .map((item) => fs.realpathSync(item));
    const pluginInfos = Array.from(new Set([...pluginFolders, ...storagePluginFolders, ...tachybasePluginFolders]))
      .filter((item) => {
        const dirname = path.dirname(item);
        const clientJs = path.join(dirname, 'client.js');
        return fs.existsSync(clientJs);
      })
      .map((pluginPackageJsonPath) => {
        const pluginPackageJson = require(pluginPackageJsonPath);
        const pluginPathArr = pluginPackageJsonPath.replaceAll(path.sep, '/').split('/');
        const hasNamespace = pluginPathArr[pluginPathArr.length - 3].startsWith('@');
        const pluginFileName = (
          hasNamespace
            ? `${pluginPathArr[pluginPathArr.length - 3].replace('@', '')}_${pluginPathArr[pluginPathArr.length - 2]}`
            : pluginPathArr[pluginPathArr.length - 2]
        ).replaceAll('-', '_');

        let exportStatement = '';
        if (pluginPackageJsonPath.includes('packages')) {
          const pluginSrcClientPath = path
            .relative(this.packagesPath, path.join(path.dirname(pluginPackageJsonPath), 'src', 'client'))
            .replaceAll(path.sep, '/');
          exportStatement = `export { default } from '${pluginSrcClientPath}';`;
          exportStatement += '\n';
          exportStatement += `export * from '${pluginSrcClientPath}';`;
        } else {
          exportStatement = `export { default } from '${pluginPackageJson.name}/client';`;
          exportStatement += '\n';
          exportStatement += `export * from '${pluginPackageJson.name}/client';`;
        }
        return { exportStatement, pluginFileName, packageJsonName: pluginPackageJson.name };
      });

    return pluginInfos;
  }
}

exports.getUmiConfig = getUmiConfig;
exports.resolveTachybasePackagesAlias = resolveTachybasePackagesAlias;
exports.IndexGenerator = IndexGenerator;
