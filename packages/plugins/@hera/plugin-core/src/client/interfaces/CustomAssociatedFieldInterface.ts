import { CollectionFieldInterface, defaultProps } from '@tachybase/client';

export class CustomAssociatedFieldInterface extends CollectionFieldInterface {
  name = 'customAssociated';
  type = 'object';
  group = 'relation';
  order = 10;
  title = '自定义关联字段';
  description = '自定义关联字段';
  isAssociation = true;
  default = {
    type: 'virtual',
    // type: 'belongsTo',
    // name,
    uiSchema: {
      // title,
      'x-component': 'CustomAssociatedField',
    },
  };
  availableTypes = ['belongsTo'];
  properties = {
    ...defaultProps,
    'uiSchema.x-component-props.component': {
      type: 'string',
      title: '组件',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: ' {{ useGetCustomAssociatedComponents() }}',
      required: true,
      description: '需要在插件中注册相应的组件后可以使用',
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
