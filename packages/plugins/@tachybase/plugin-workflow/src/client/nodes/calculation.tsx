import { SchemaInitializerItemType } from '@nocobase/client';
import { Evaluator, evaluators, getOptions } from '@nocobase/evaluators/client';

import { RadioWithTooltip } from '../components/RadioWithTooltip';
import { ValueBlock } from '../components/ValueBlock';
import { renderEngineReference } from '../components/renderEngineReference';
import { NAMESPACE, lang } from '../locale';
import { BaseTypeSets, WorkflowVariableTextArea, defaultFieldNames } from '../variable';
import { Instruction } from '.';

export default class extends Instruction {
  title = `{{t("Calculation", { ns: "${NAMESPACE}" })}}`;
  type = 'calculation';
  group = 'control';
  description = `{{t("Calculate an expression based on a calculation engine and obtain a value as the result. Variables in the upstream nodes can be used in the expression.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    engine: {
      type: 'string',
      title: `{{t("Calculation engine", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'RadioWithTooltip',
      'x-component-props': {
        options: getOptions(),
      },
      required: true,
      default: 'math.js',
    },
    expression: {
      type: 'string',
      title: `{{t("Calculation expression", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableTextArea',
      'x-component-props': {
        changeOnSelect: true,
      },
      ['x-validator'](value, rules, { form }) {
        const { values } = form;
        const { evaluate } = evaluators.get(values.engine) as Evaluator;
        const exp = value.trim().replace(/{{([^{}]+)}}/g, ' 1 ');
        try {
          evaluate(exp);
          return '';
        } catch (e) {
          return lang('Expression syntax error');
        }
      },
      'x-reactions': [
        {
          dependencies: ['engine'],
          fulfill: {
            schema: {
              description: '{{renderEngineReference($deps[0])}}',
            },
          },
        },
      ],
      required: true,
    },
    // 加一个单选框，根据选择的引擎，显示这个单选框
    transString: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-content': `解析字符串公式`,
      'x-reactions': [
        {
          dependencies: ['engine'],
          fulfill: {
            state: {
              visible: '{{$deps[0] == `formula.js`}}',
            },
          },
        },
      ],
    },
  };
  scope = {
    renderEngineReference,
  };
  components = {
    WorkflowVariableTextArea,
    RadioWithTooltip,
    ValueBlock,
  };
  useVariables({ key, title }, { types, fieldNames = defaultFieldNames }) {
    if (
      types &&
      !types.some((type) => type in BaseTypeSets || Object.values(BaseTypeSets).some((set) => set.has(type)))
    ) {
      return null;
    }
    return {
      [fieldNames.value]: key,
      [fieldNames.label]: title,
    };
  }
  useInitializers(node): SchemaInitializerItemType {
    return {
      name: node.title ?? `#${node.id}`,
      type: 'item',
      title: node.title ?? `#${node.id}`,
      Component: ValueBlock.Initializer,
      node,
      resultTitle: lang('Calculation result'),
    };
  }
}
