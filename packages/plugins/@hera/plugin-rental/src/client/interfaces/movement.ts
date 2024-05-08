import { CollectionFieldInterface, dataSource, defaultProps, operators } from '@tachybase/client';
import { tval } from '../locale';
import { Field, uid } from '@tachybase/schema';

export class MovementFieldInterface extends CollectionFieldInterface {
  name = 'movement';
  type = 'object';
  group = 'bussiness';
  title = tval('Movement');
  sortable = true;
  default = {
    type: 'string',
    uiSchema: {
      type: 'string',
      'x-component': 'Movement',
    },
  };
  availableTypes = ['string', 'integer', 'boolean', 'integer'];
  properties = {
    ...defaultProps,
    'uiSchema.x-component-props.left': {
      type: 'string',
      title: tval('Left part'),
      required: true,
      'x-component': 'Expression',
      'x-decorator': 'FormItem',
      'x-component-props': {
        useCurrentFields: '{{ useCurrentFields }}',
      },
    },
    'uiSchema.x-component-props.right': {
      type: 'string',
      title: tval('Right part'),
      required: true,
      'x-component': 'Expression',
      'x-decorator': 'FormItem',
      'x-component-props': {
        useCurrentFields: '{{ useCurrentFields }}',
      },
    },
    'uiSchema.enum': {
      type: 'array',
      title: tval('Options'),
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      'x-component-props': {
        pagination: {
          pageSize: 1000,
        },
      },
      items: {
        type: 'object',
        properties: {
          column1: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 50, title: '', align: 'center' },
            properties: {
              sort: {
                type: 'void',
                'x-component': 'ArrayTable.SortHandle',
              },
            },
          },
          column2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: tval('Option value') },
            properties: {
              value: {
                type: 'string',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-reactions': (field: Field) => {
                  if (!field.initialValue) {
                    field.initialValue = uid();
                  }
                },
              },
            },
          },
          column3: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: tval('Option label') },
            properties: {
              label: {
                type: 'string',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          },
          column5: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: '',
              dataIndex: 'operations',
              fixed: 'right',
            },
            properties: {
              item: {
                type: 'void',
                'x-component': 'FormItem',
                properties: {
                  remove: {
                    type: 'void',
                    'x-component': 'ArrayTable.Remove',
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          'x-component': 'ArrayTable.Addition',
          'x-component-props': {
            randomValue: true,
          },
          title: tval('Add option'),
        },
      },
    },
    defaultValue: {
      type: 'string',
      title: tval('default value'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-reactions': {
        dependencies: ['.uiSchema.enum'],
        when: '{{$deps.length > 0}}',
        fulfill: {
          schema: {
            enum: '{{ $deps[0].map((item) => ({label: item.label, value: item.value})) }}',
          },
        },
      },
    },
  };
  filterable = {
    operators: operators.enumType,
  };
  titleUsable = true;
}
