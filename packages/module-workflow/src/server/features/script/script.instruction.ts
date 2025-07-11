import crypto from 'node:crypto';
import { createContext, Script } from 'node:vm';
import { Context } from '@tachybase/actions';
import { dayjs } from '@tachybase/utils';

import { transform } from '@babel/core';
import jsonata from 'jsonata';
import _ from 'lodash';
import qrcode from 'qrcode';

import { FlowNodeModel, Instruction, JOB_STATUS, Processor } from '../..';

export class ScriptInstruction extends Instruction {
  async run(node: FlowNodeModel, input: any, processor: Processor) {
    const { sourceArray, type, code = '', model } = node.config;
    // 1. 获取数据源
    let data = {};

    switch (sourceArray.length) {
      case 0: {
        // 无数据源,使用默认值
        data = {};
        break;
      }
      case 1: {
        // 单数据源, 平铺为单对象; 忽略keyName
        const keyName = sourceArray[0]['keyName'];
        const sourcePath = sourceArray[0]['sourcePath'];
        const rawData = processor.getParsedValue(sourcePath, node.id);
        // NOTE: 后来想了想, 发现还是统一用法比较好. 所以提供统一的用法, 同时保留原本的用法; 如果提供了keyName 就是统一的用法, 如果没有, 就是平铺.
        if (keyName) {
          data = {
            [keyName]: rawData,
          };
        } else {
          data = rawData;
        }
        break;
      }
      default: {
        // 多个数据源, 进行合并
        data = sourceArray.reduce(
          (cookedData, { keyName, sourcePath }) => ({
            ...cookedData,
            [keyName]: processor.getParsedValue(sourcePath, node.id),
          }),
          {},
        );
      }
    }

    try {
      // 2. 根据 type 类型, 对源数据进行复杂数据映射
      let result = {};
      switch (type) {
        case 'jsonata':
          result = await convertByJSONata(code, data);
          break;
        case 'js':
          result = await convertByJsCode(code, data);
          break;
        case 'ts':
          result = await convertByTsCode(code, data, processor);
          break;
        default:
      }

      // 3. 将结果集, 进行简单数据映射
      if (typeof result === 'object' && result && model?.length) {
        if (Array.isArray(result)) {
          result = result.map((item) => mapModel(item, model));
        } else {
          result = mapModel(result, model);
        }
      }

      // 4. 返回结果集, 和节点执行状态
      return {
        result,
        status: JOB_STATUS.RESOLVED,
      };
    } catch (err) {
      return {
        result: err.toString(),
        status: JOB_STATUS.ERROR,
      };
    }
  }
}

// utils-JSONata
async function convertByJSONata(code, data) {
  const engine = (expression, data) => jsonata(expression).evaluate(data);
  const result = await engine(code, data);
  return result;
}

// utils-jsCode
async function convertByJsCode(code, data) {
  const ctx = {
    data,
    body: {},
  };
  await evalSimulate(code, {
    ctx,
    lib: {
      log: console.log,
      JSON,
      qrcode,
      crypto,
      jsonata,
      dayjs,
    },
  });

  return ctx.body;
}

async function convertByTsCode(code, data, processor: Processor) {
  const options = processor.options;
  const app = processor.options.plugin.app;

  const compiledCode = transform(code, {
    sourceType: 'module',
    filename: 'a.tsx',
    presets: [
      [
        require('@babel/preset-env'),
        {
          modules: 'commonjs',
          targets: {
            node: 'current',
          },
        },
      ],
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
  }).code;

  // 创建一个独立的模块上下文
  const script = new Script(compiledCode);

  const defaultFunction = async (event, context) => {
    return {};
  };

  const contextRequire = function (moduleName: string) {
    // FIXME
    if (moduleName === '@tachybase/utils/client') {
      return require.call(this, '@tachybase/utils');
    }
    if (moduleName === '@tachybase/module-pdf/client') {
      return require.call(this, '@tachybase/module-pdf');
    }
    if (moduleName === '@react-pdf/renderer') {
      return require.call(this, '@tachybase/module-pdf');
    }
    // 拦截逻辑：优先检查自定义模块表
    if (app.modules[moduleName]) {
      return app.modules[moduleName];
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
  try {
    script.runInContext(sandbox);
  } catch (error) {
    app.logger.error('Cloud Component ', { error });
  }

  // 执行默认导出的函数
  const func = sandbox.exports.default;

  const result = await func(data, {
    ...options,
  });

  return result;
}

// utils
function mapModel(data, model) {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid data: data should be a non-null object');
  }

  const result = model.reduce((acc, { path, alias }) => {
    const key = alias ?? path.replace(/\./g, '_');
    const value = _.get(data, path);
    acc[key] = value;

    return acc;
  }, {});

  return result;
}

async function evalSimulate(jsCode, { ctx, lib }) {
  const AsyncFunction: any = async function () {}.constructor;
  return await new AsyncFunction('$root', `with($root) { ${jsCode}; }`)({
    ctx,
    // 允许用户覆盖，这个时候可以使用 _ctx
    __ctx: ctx,
    lib,
  });
}
