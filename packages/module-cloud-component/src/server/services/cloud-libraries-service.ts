import { createContext, Script } from 'node:vm';
import Database from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, Inject, InjectLog, Service } from '@tachybase/utils';

import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import Topo from '@hapi/topo';

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

    const sorter = new Topo.Sorter<{ module: string; server: string }>();

    for (const cloudLibrary of cloudLibraries) {
      // 使用 Babel 解析代码为 AST
      const ast = babelParser.parse(cloudLibrary.server, {
        sourceType: 'script', // CommonJS 使用 script 模式
      });

      // 存储 require 依赖的数组
      const dependencies = [];

      // 遍历 AST 节点
      traverse(ast, {
        CallExpression(path) {
          const callee = path.get('callee');
          if (callee.isIdentifier({ name: 'require' })) {
            const args = path.get('arguments');
            if (args.length > 0 && args[0].isStringLiteral()) {
              dependencies.push(args[0].node.value);
            }
          }
        },
      });
      sorter.add(cloudLibrary, {
        after: dependencies,
        group: cloudLibrary.module,
      });
    }

    for (const cloudLibrary of sorter.nodes) {
      // TODO: plugin service log support
      this.logger.info(`load cloudLibrarie: ${cloudLibrary.module}`);
      const compiledCode = cloudLibrary.server;

      // 创建一个独立的模块上下文
      const script = new Script(compiledCode);

      const defaultFunction = async (event, context) => {
        return {};
      };

      const that = this;
      const contextRequire = function (moduleName: string) {
        // FIXME:
        if (moduleName === '@tachybase/utils/client') {
          return require.call(this, '@tachybase/utils');
        }
        if (moduleName === '@tachybase/module-pdf/client') {
          return require.call(this, '@tachybase/module-pdf');
        }
        if (moduleName === '@react-pdf/renderer') {
          return require.call(this, '@tachybase/module-pdf');
        }
        // compatible with old hera module
        if (moduleName === '@hera/plugin-core') {
          return require.call(this, '@tachybase/module-hera');
        }
        // 拦截逻辑：优先检查自定义模块表
        if (that.app.modules[moduleName]) {
          return that.app.modules[moduleName];
        }
        try {
          return require.call(this, moduleName);
        } catch (error) {
          that.logger.warn(moduleName + ' module not found. ', { meta: error });
          return {};
        }
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
    this.app.acl.addFixedParams('cloudLibraries', 'destroy', () => {
      return {
        filter: {
          enabeld: false,
        },
      };
    });
  }
}
