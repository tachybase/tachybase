import { createContext, Script } from 'node:vm';
import { InjectedPlugin, Plugin } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import { transform } from '@babel/core';
import _ from 'lodash';

import { CloudLibrariesController } from './actions/CloudLibrariesController';

@InjectedPlugin({
  Controllers: [CloudLibrariesController],
})
export class ModuleCloudComponentServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.on('afterStart', async () => {
      const repo = this.db.getRepository('cloudLibraries');
      const cloudLibraries = await repo.find({
        filter: {
          enabled: true,
          isServer: true,
        },
      });

      for (const cloudLibrary of cloudLibraries) {
        this.log.info(`load cloudLibrarie: ${cloudLibrary.module}`);
        const code = cloudLibrary.code;
        const compiledCode = transform(code, {
          sourceType: 'module',
          filename: `cloud-component-${uid()}.tsx`,
          presets: [
            [
              '@babel/preset-env',
              {
                modules: 'commonjs',
                targets: {
                  node: 'current',
                },
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        }).code;

        // 创建一个独立的模块上下文
        const script = new Script(compiledCode);

        const defaultFunction = async (event, context) => {
          return {};
        };

        const contextRequire = function (moduleName: string) {
          // 拦截逻辑：优先检查自定义模块表
          if (this.app.modules[moduleName]) {
            return this.app.modules[moduleName];
          }
          return require.call(this, moduleName);
        };
        Object.assign(contextRequire, require);

        // 创建上下文并加载 Node 的标准模块
        const sandbox = {
          module: {},
          exports: { default: defaultFunction },
          require: contextRequire,
          console,
        };
        createContext(sandbox);

        // 执行代码并导出结果
        script.runInContext(sandbox);

        // 将结果存储在 app.modules 中
        this.app.modules[cloudLibrary.module] = sandbox.exports;
      }
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default ModuleCloudComponentServer;
