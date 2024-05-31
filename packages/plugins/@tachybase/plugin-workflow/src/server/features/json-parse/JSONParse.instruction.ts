import jsonata from 'jsonata';
import _ from 'lodash';

import { FlowNodeModel, Instruction, JOB_STATUS, Processor } from '../..';

export class JSONParseInstruction extends Instruction {
  engine = (expression, scope) => jsonata(expression).evaluate(scope);
  async run(node: FlowNodeModel, input: any, processor: Processor) {
    const { source = '', expression = '', model } = node.config;
    const data = processor.getParsedValue(source, node.id);
    const query = this.engine;
    try {
      let result = query ? await query(expression, data) : data;

      if (typeof result === 'object' && result && model?.length) {
        if (Array.isArray(result)) {
          result = result.map((item) => mapModel(item, model));
        } else {
          result = mapModel(result, model);
        }
      }

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
