import { interfacesProperties, CollectionFieldInterface } from '@nocobase/client';
const { defaultProps } = interfacesProperties;

export class CustomFieldInterface extends CollectionFieldInterface {
  name = 'custom';
  type = 'object';
  group = 'advanced';
  title = '自定义字段';
  description = '自定义字段';
  sortable = true;
  default = {
    type: 'virtual',
    uiSchema: {
      type: 'string',
      'x-component': 'CustomField',
      'x-read-pretty': true,
    },
  };
  properties = {
    ...defaultProps,
    'uiSchema.x-component-props.component': {
      type: 'string',
      title: '组件',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: ' {{ useGetCustomComponents() }} ',
      required: true,
      description: '需要在插件中注册相应的组件后可以使用',
    },
  };
}
