import { interfacesProperties, CollectionFieldInterface } from '@nocobase/client';
const { defaultProps } = interfacesProperties;

const formulaType = [
  {
    dependencies: ['dataType'],
    fulfill: {
      state: {
        display: '{{["formula"].includes($deps[0]) ? "visible" : "none"}}',
      },
    },
  },
];

const panelType = [
  {
    dependencies: ['dataType'],
    fulfill: {
      state: {
        display: '{{["jsCode"].includes($deps[0]) ? "visible" : "none"}}',
      },
    },
  },
];

export class CalcFieldInterface extends CollectionFieldInterface {
  name = 'calc2';
  type = 'object';
  group = 'advanced';
  title = '数据计算';
  description = '数据字段计算';
  sortable = true;
  default = {
    type: 'virtual',
    uiSchema: {
      type: 'string',
      'x-component': 'CalcResult',
      'x-component-props': {
        formula: '',
        prefix: '',
        suffix: '',
        decimal: '',
        panel: '',
      },
      'x-read-pretty': true,
    },
  };
  properties = {
    ...defaultProps,
    dataType: {
      type: 'string',
      title: '计算类型',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { value: 'formula', label: '公式' },
        { value: 'jsCode', label: '代码' },
      ],
      required: true,
      default: 'formula',
      description: '公式：使用公式计算，代码：使用js代码计算',
    },
    'uiSchema.x-component-props.formula': {
      type: 'string',
      title: '公式',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '',
      required: true,
      'x-reactions': formulaType,
    },
    'uiSchema.x-component-props.panel': {
      type: 'string',
      title: 'jsCode',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      description: '注意，此内容有值计算操作将以此内容为准，而不是公式，适用于面板中的计算',
      required: true,
      'x-reactions': panelType,
    },
    'uiSchema.x-component-props.prefix': {
      type: 'string',
      title: '前缀',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    'uiSchema.x-component-props.suffix': {
      type: 'string',
      title: '后缀',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    'uiSchema.x-component-props.decimal': {
      type: 'string',
      title: '{{t("Precision")}}',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      required: true,
      default: '0',
      enum: [
        { value: '0', label: '1' },
        { value: '1', label: '1.0' },
        { value: '2', label: '1.00' },
        { value: '3', label: '1.000' },
        { value: '4', label: '1.0000' },
        { value: '5', label: '1.00000' },
      ],
      'x-reactions': formulaType,
    },
  };
}
