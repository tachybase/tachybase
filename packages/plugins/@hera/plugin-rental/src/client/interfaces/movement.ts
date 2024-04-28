import { CollectionFieldInterface, dataSource, defaultProps, operators } from '@nocobase/client';
import { tval } from '../locale';

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
      'x-component': 'Radio.Group',
    },
  };
  availableTypes = ['string', 'integer', 'boolean', 'integer'];
  hasDefaultValue = true;
  properties = {
    ...defaultProps,
    // 'uiSchema.enum': dataSource,
  };
  filterable = {
    operators: operators.enumType,
  };
  titleUsable = true;
}
