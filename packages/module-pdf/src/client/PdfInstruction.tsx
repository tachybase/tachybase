import { css, tval } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';
import {
  Instruction,
  NodeAvailableContext,
  VariableOption,
  WorkflowVariableInput,
} from '@tachybase/module-workflow/client';

export class PdfInstruction extends Instruction {
  title = tval('pdf');
  type = 'pdf';
  group = 'extended';
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
        { label: 'js', value: 'js' },
        { label: 'JSONata', value: 'jsonata' },
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
      },
    },
  };
  components: any = {
    ArrayTable,
    WorkflowVariableInput,
  };

  isAvailable(ctx: NodeAvailableContext): boolean {
    return false;
  }

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
