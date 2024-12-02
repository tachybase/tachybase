import { createContext, Script } from 'node:vm';
import Database from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, Inject, InjectLog, Service } from '@tachybase/utils';

import { CloudCompiler } from './cloud-compiler';

@Service()
export class CloudLibrariesService {
  @Db()
  db: Database;

  @App()
  app: Application;

  @InjectLog()
  private logger: Logger;

  @Inject(() => CloudCompiler)
  private compiler: CloudCompiler;

  async compileLibraries() {
    const libRepo = this.app.db.getRepository('cloudLibraries');
    const libs = await libRepo.find({
      filter: {
        enabled: true,
      },
    });

    const repo = this.app.db.getRepository('effectLibraries');
    for (const lib of libs) {
      const {
        name,
        code: debugCode,
        module,
        isClient,
        isServer,
        serverPlugin,
        clientPlugin,
        enabled,
        version,
        component,
        versions,
      } = lib;

      // load specified version
      let code = debugCode;
      if (version && version !== 'debug') {
        code = versions[Number[version]].code;
      }

      const clientCode = this.compiler.toAmd(code);
      const serverCode = this.compiler.toCjs(code);
      repo.updateOrCreate({
        filterKeys: ['module'],
        values: {
          name,
          module,
          enabled,
          server: serverCode,
          client: clientCode,
          isClient,
          isServer,
          serverPlugin,
          clientPlugin,
          component,
        },
      });
    }
  }

  async loadServerLibraries() {
    this.logger.info(`load cloudLibrarie: start`);
    const repo = this.app.db.getRepository('effectLibraries');
    const cloudLibraries = await repo.find({
      filter: {
        enabled: true,
        isServer: true,
      },
    });

    for (const cloudLibrary of cloudLibraries) {
      // TODO: plugin service log support
      this.logger.info(`load cloudLibrarie: ${cloudLibrary.module}`);
      const compiledCode = cloudLibrary.server;

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
  }

  async load() {
    this.app.acl.allow('effectLibraries', 'list', 'public');
    this.app.on('afterStart', async () => {
      await this.compileLibraries();
      await this.loadServerLibraries();
    });
  }
}
