import { css } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';

import { VariableOption, WorkflowVariableInput } from '../..';
import { NAMESPACE_INSTRUCTION_DATA_MAPPING } from '../../../common/constants';
import { tval } from '../../locale';
import { Instruction } from '../../nodes/default-node/interface';

export class DataMappingInstruction extends Instruction {
  title = tval('Data Mapping');
  type = NAMESPACE_INSTRUCTION_DATA_MAPPING;
  group = 'extended';
  icon = 'FunctionOutlined';
  color = '#d93a13';
  isHot = true;
  description = tval('Get specific data from JSON result of any node BY js code or json code;');
  fieldset = {
    sourceArray: {
      type: 'array',
      title: tval('Data source map'),
      description: tval('Data source map'),
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      items: {
        type: 'object',
        properties: {
          keyName: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: tval('keyName'),
            },
            properties: {
              keyName: {
                type: 'string',
                name: 'keyName',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          sourcePath: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: tval('Property path'),
            },
            properties: {
              sourcePath: {
                type: 'string',
                name: 'sourcePath',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'WorkflowVariableInput',
                'x-component-props': {
                  changeOnSelect: true,
                },
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
    type: {
      type: 'string',
      title: tval('type'),
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: 'JavaScript', value: 'js' },
        { label: 'JSONata', value: 'jsonata' },
        { label: 'TypeScript', value: 'ts' },
      ],
      default: 'js',
    },
    code: {
      type: 'string',
      title: tval('expression'),
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        tooltip: 'jscode: ctx.data\nctx.body\n__ctx\nlib.JSON\nlib.qrcode\ncanvas\nlib.dayjs\nlib.log',
      },
      'x-component': 'CodeMirror',
      'x-component-props': {
        defaultLanguage: 'typescript',
        height: '80vh',
        defaultValue:
          "// import test from 'test'\n// export default async function (data, ctx: { httpContext: any }) {\n//  return {\n//\n//  }\n// }",
      },
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
