import { useCollectionDataSource } from '@tachybase/client';

import { FilterDynamicComponent } from '../components/FilterDynamicComponent';
import { lang, NAMESPACE } from '../locale';
import { collection, filter } from '../schemas/collection';
import { isValidFilter } from '../utils';
import { Instruction } from './default-node/interface';

export default class extends Instruction {
  title = '{{t("Delete record")}}';
  type = 'destroy';
  group = 'collection';
  icon = 'ClockCircleOutlined';
  color = '#fa0b07';
  description = `{{t("Delete records of a collection. Could use variables in workflow context as filter. All records match the filter will be deleted.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    collection: {
      ...collection,
      'x-reactions': [
        ...collection['x-reactions'],
        {
          target: 'params',
          fulfill: {
            state: {
              visible: '{{!!$self.value}}',
            },
          },
        },
        {
          target: 'params',
          effects: ['onFieldValueChange'],
          fulfill: {
            state: {
              value: '{{Object.create({})}}',
            },
          },
        },
      ],
    },
    params: {
      type: 'object',
      properties: {
        filter: {
          ...filter,
          ['x-validator'](value) {
            return isValidFilter(value) ? '' : lang('Please add at least one condition');
          },
        },
      },
    },
  };
  scope = {
    useCollectionDataSource,
  };
  components = {
    FilterDynamicComponent,
  };
}
