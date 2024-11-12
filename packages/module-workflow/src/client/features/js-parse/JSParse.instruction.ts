import { css } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';

import { VariableOption, WorkflowVariableInput } from '../..';
import { NAMESPACE_INSTRUCTION_JS_PARSE } from '../../../common/constants';
import { tval } from '../../locale';
import { Instruction } from '../../nodes';

export class JSParseInstruction extends Instruction {
  title = tval('JS Parse');
  type = NAMESPACE_INSTRUCTION_JS_PARSE;
  // XXX: 这里应该定义在 workflow 里的一个统一的地方. workflow 本身没处理好这块, 先这样直接写了.
  group = 'extended';
  description = tval('Get specific data from JSON result of any node BY js code;');
  fieldset = {
    source: {
      type: 'string',
      title: tval('Data source'),
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableInput',
      'x-component-props': {
        changeOnSelect: true,
      },
      required: true,
    },
    JSCode: {
      type: 'string',
      title: tval('JSCode expression'),
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        tooltip: 'ctx.data\nctx.body\n__ctx\nlib.JSON\nlib.qrcode\ncanvas\nlib.dayjs\nlib.log',
      },
      'x-component': 'CodeMirror',
      required: true,
    },
    model: {
      type: 'array',
      title: tval('Properties mapping'),
      description: tval(
        'If the type of query result is object or array of object, could map the properties which to be accessed in subsequent nodes.',
      ),
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      items: {
        type: 'object',
        properties: {
          path: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: tval('Property path'),
            },
            properties: {
              path: {
                type: 'string',
                name: 'path',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          alias: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: tval('Alias'),
            },
            properties: {
              alias: {
                type: 'string',
                name: 'alias',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          label: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: tval('Label'),
            },
            properties: {
              label: {
                type: 'string',
                name: 'label',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          operations: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              dataIndex: 'operations',
              fixed: 'right',
              className: css`
                > *:not(:last-child) {
                  margin-right: 0.5em;
                }
                button {
                  padding: 0;
                }
              `,
            },
            properties: {
              remove: {
                type: 'void',
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: tval('Add property'),
          'x-component': 'ArrayTable.Addition',
          'x-component-props': {
            defaultValue: {},
          },
        },
      },
    },
  };
  components = {
    ArrayTable,
    WorkflowVariableInput,
  };

  useVariables(node, options): VariableOption {
    const { key, title, config } = node;
    const { types, fieldNames } = options;
    const model = config.model || [];
    const result = {
      [fieldNames.label]: title,
      [fieldNames.value]: key,
      [fieldNames.children]: model.map((item) => ({
        [fieldNames.label]: item.label,
        [fieldNames.value]: item.alias || item.path,
      })),
    };
    return result;
  }
}
