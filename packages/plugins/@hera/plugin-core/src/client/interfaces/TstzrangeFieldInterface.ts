import { defaultProps, CollectionFieldInterface } from '@nocobase/client';
import { tval } from '../locale';

export class TstzrangeFieldInterface extends CollectionFieldInterface {
  name = 'tstzrange';
  type = 'object';
  group = 'datetime';
  order = 2;
  title = tval('Date range');
  sortable = true;
  default = {
    type: 'tstzrange',
    uiSchema: {
      type: 'object',
      'x-component': 'DatePicker.RangePicker',
      'x-component-props': {
        utc: false,
        valueType: 'range',
      },
    },
  };
  availableTypes = ['tstzrange'];
  hasDefaultValue = false;

  properties = {
    ...defaultProps,
  };
}
