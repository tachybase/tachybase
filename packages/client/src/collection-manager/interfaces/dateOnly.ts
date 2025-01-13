import { CollectionFieldInterface } from '../../data-source/collection-field-interface/CollectionFieldInterface';
import { dateTimeProps, defaultProps, operators } from './properties';

export class DateFieldInterface extends CollectionFieldInterface {
  name = 'date';
  type = 'object';
  group = 'datetime';
  order = 3;
  title = '{{t("DateOnly")}}';
  sortable = true;
  default = {
    type: 'dateOnly',
    uiSchema: {
      type: 'string',
      'x-component': 'DatePicker',
      'x-component-props': {
        dateOnly: true,
      },
    },
  };
  availableTypes = ['dateOnly'];
  hasDefaultValue = true;
  properties = {
    ...defaultProps,
    ...dateTimeProps,
    'uiSchema.x-component-props.showTime': {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-visible': false,
    },
  };
  filterable = {
    operators: operators.datetime,
  };
  titleUsable = true;
}
