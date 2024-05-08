import { Evaluator, evaluators } from '@tachybase/evaluators';
import { parse } from '@tachybase/utils';
import { Instruction } from '.';
import type Processor from '../Processor';
import { JOB_STATUS } from '../constants';
import type { FlowNodeModel } from '../types';
import { cloneDeep, get } from 'lodash';

export interface CalculationConfig {
  engine?: string;
  expression?: string;
}

export class CalculationInstruction extends Instruction {
  async run(node: FlowNodeModel, prevJob, processor: Processor) {
    const { engine = 'math.js', expression = '', transString = false } = node.config;
    const scope = processor.getScope(node.id);
    const evaluator = <Evaluator | undefined>evaluators.get(engine);

    try {
      let result = evaluator && expression ? evaluator(expression, scope) : null;
      if (transString && engine === 'formula.js') {
        const context = cloneDeep(scope);
        const targetVal = expression.trim().replace(/{{\s*([\w$.-]+)\s*}}/g, (_, v) => {
          const item = get(context, v) ?? null;
          return item;
        });
        result = evaluators.get(engine)(targetVal);
      }
      return {
        result,
        status: JOB_STATUS.RESOLVED,
      };
    } catch (e) {
      return {
        result: e.toString(),
        status: JOB_STATUS.ERROR,
      };
    }
  }
}

export default CalculationInstruction;
