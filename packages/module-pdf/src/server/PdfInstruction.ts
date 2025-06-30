import { createContext, Script } from 'node:vm';
import { Context } from '@tachybase/actions';
import { FlowNodeModel, Instruction, JOB_STATUS, Processor } from '@tachybase/module-workflow';

import { transform } from '@babel/core';
import _ from 'lodash';

export class PdfInstruction extends Instruction {
  async run(node: FlowNodeModel, input: any, processor: Processor) {
    const { sourceArray, type, code = '', model } = node.config;
    // 1. 获取数据源
    let data = {};

    switch ((sourceArray || []).length) {
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
      const { httpContext } = processor.options as unknown as {
        httpContext: Context;
      };

      const myresult = transform(code, {
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

      // 编译后的代码作为一个模块执行
      const compiledCode = myresult;

      // 创建一个独立的模块上下文
      const script = new Script(compiledCode);

      const defaultFunction = async (event, context) => {};

      // 创建上下文并加载 Node 的标准模块
      const sandbox = {
        module: {},
        exports: { default: defaultFunction },
        require,
        console,
      };
      createContext(sandbox);

      // 执行代码并导出结果
      script.runInContext(sandbox);

      // 执行默认导出的函数
      const func = sandbox.exports.default;

      const result = await func(data, {
        httpContext,
      });

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
