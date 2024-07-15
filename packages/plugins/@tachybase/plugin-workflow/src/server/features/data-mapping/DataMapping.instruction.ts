import crypto from 'crypto';

import * as canvas from 'canvas';
import jsonata from 'jsonata';
import _ from 'lodash';
import qrcode from 'qrcode';

import { FlowNodeModel, Instruction, JOB_STATUS, Processor } from '../..';

export class DataMappingInstruction extends Instruction {
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
        const source = sourceArray[0]['sourcePath'];
        data = processor.getParsedValue(source, node.id);
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
        default:
          result = await convertByJsCode(code, data);
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
      canvas,
      qrcode,
      crypto,
      jsonata,
    },
  });

  return ctx.body;
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
