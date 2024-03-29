import { CollectionFieldInterface, defaultProps } from '@nocobase/client';

export class AssociatedFieldInterface extends CollectionFieldInterface {
  name = 'associated';
  type = 'object';
  group = 'relation';
  order = 10;
  title = '关联字段';
  description = '关联字段';
  isAssociation = true;
  default = {
    type: 'belongsTo',
    // name,
    uiSchema: {
      // title,
      'x-component': 'AssociatedField',
    },
  };
  availableTypes = ['belongsTo'];
  properties = {
    ...defaultProps,
    'uiSchema.x-component-props.collection': {
      type: 'string',
      title: '关联数据表',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        multiple: false,
      },
      enum: '{{collections}}',
      required: true,
    },
    'uiSchema.x-component-props.sourceCollection': {
      type: 'string',
      title: '查询数据表',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        multiple: false,
      },
      enum: '{{collections}}',
      required: true,
    },
    'uiSchema.x-component-props.sourceField': {
      type: 'string',
      title: '查询数据表到关联数据表的路径',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      required: true,
    },
    'uiSchema.x-component-props.fieldExp': {
      type: 'string',
      title: '关联字段',
      required: true,
      'x-component': 'Expression',
      'x-decorator': 'FormItem',
      'x-component-props': {
        useCurrentFields: '{{ useCurrentFields }}',
      },
    },
    'uiSchema.x-component-props.dateFieldExp': {
      type: 'string',
      title: '关联日期',
      required: true,
      'x-component': 'Expression',
      'x-decorator': 'FormItem',
      'x-component-props': {
        useCurrentFields: '{{ useCurrentFields }}',
      },
    },
    target: {
      type: 'string',
      title: '关联数据表',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        multiple: false,
      },
      enum: '{{collections}}',
      required: true,
      'x-display': 'hidden',
      'x-reactions': [
        {
          dependencies: ['uiSchema.x-component-props.collection'],
          fulfill: {
            state: {
              value: '{{$deps[0]}}',
            },
          },
        },
      ],
    },
    targetKey: {
      type: 'string',
      title: '关联数据表键',
      required: true,
      default: 'id',
      'x-display': 'hidden',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  };
  filterable = {
    nested: true,
    children: [],
  };
}
