import { CollectionFieldInterface, interfacesProperties } from '@tachybase/client';

const { defaultProps } = interfacesProperties;

export interface FormulaProps {
  // 公式字符串
  formulaString: string;
  // 前缀
  prefix: string;
  // 后缀
  suffix: string;
  // 精度
  decimal: string;
}

export class ShowFieldFormulaInterface extends CollectionFieldInterface {
  name = 'formulaShow';
  type = 'object';
  group = 'advanced';
  title = '公式(显示)';
  description = '通过公式, 用于定制化显示用户界面内容';
  sortable = true;
  default = {
    type: 'virtual',
    uiSchema: {
      type: 'string',
      'x-component': 'Viewformula',
      'x-component-props': {
        formulaString: '',
        prefix: '',
        suffix: '',
        decimal: '',
      } as FormulaProps,
      'x-read-pretty': true,
    },
  };
  properties = {
    ...defaultProps,
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
    },
    'uiSchema.x-component-props.formulaString': {
      type: 'string',
      title: '公式',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '',
      required: true,
    },
  };
}
