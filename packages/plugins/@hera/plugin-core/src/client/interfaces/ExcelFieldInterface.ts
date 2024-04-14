import { defaultProps, CollectionFieldInterface } from '@nocobase/client';
import { tval } from '../locale';

export class ExcelFieldInterface extends CollectionFieldInterface {
  name = 'excelField';
  type = 'json';
  group = 'advanced';
  order = 3;
  title = tval('Excel table');
  sortable = true;
  default = {
    interface: 'json',
    type: 'json',
    uiSchema: {
      type: 'object',
      'x-component': 'ExcelFile',
    },
  };
  availableTypes = ['json'];
  hasDefaultValue = false;

  properties = {
    ...defaultProps,
  };
}
