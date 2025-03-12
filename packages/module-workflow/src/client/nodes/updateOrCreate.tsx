import React from 'react';
import { useCollectionDataSource, useCollectionManager_deprecated } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { RadioWithTooltip } from '../components';
import CollectionFieldset from '../components/CollectionFieldset';
import { FilterDynamicComponent } from '../components/FilterDynamicComponent';
import { lang, NAMESPACE } from '../locale';
import { collection, filter, values } from '../schemas/collection';
import { isValidFilter } from '../utils';
import { Instruction } from './default-node/interface';

function IndividualHooksRadioWithTooltip({ onChange, ...props }) {
  const { getCollectionFields } = useCollectionManager_deprecated();
  const form = useForm();
  const { collection } = form.values;
  const fields = getCollectionFields(collection);
  const field = useField<any>();

  function onValueChange({ target }) {
    const valuesField = field.query('.values').take();
    if (!valuesField) {
      return;
    }
    const filteredValues = fields.reduce((result, item) => {
      if (item.name in valuesField.value && (target.value || ![].includes(item.type))) {
        result[item.name] = valuesField.value[item.name];
      }
      return result;
    }, {});
    form.setValuesIn('params.values', filteredValues);

    onChange(target.value);
  }
  return <RadioWithTooltip {...props} onChange={onValueChange} />;
}

export default class extends Instruction {
  title = `{{t("Update or create record", { ns: "${NAMESPACE}" })}}`;
  type = 'updateorcreate';
  group = 'collection';
  icon = 'FileSyncOutlined';
  color = '#f8f800';
  description = `{{t("Update or create data, with the ability to assign values to fields using variables from upstream nodes.", { ns: "${NAMESPACE}" })}}`;
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
          target: 'params.filter',
          effects: ['onFieldValueChange'],
          fulfill: {
            state: {
              value: '{{Object.create({})}}',
            },
          },
        },
        {
          target: 'params.values',
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
        individualHooks: {
          type: 'boolean',
          title: `{{t("Update mode", { ns: "${NAMESPACE}" })}}`,
          'x-decorator': 'FormItem',
          'x-component': 'IndividualHooksRadioWithTooltip',
          'x-component-props': {
            options: [
              {
                label: `{{t("Update in a batch", { ns: "${NAMESPACE}" })}}`,
                value: false,
                tooltip: `{{t("Update all eligible data at one time, which has better performance when the amount of data is large. But the updated data will not trigger other workflows, and will not record audit logs.", { ns: "${NAMESPACE}" })}}`,
              },
              {
                label: `{{t("Update one by one", { ns: "${NAMESPACE}" })}}`,
                value: true,
                tooltip: `{{t("The updated data can trigger other workflows, and the audit log will also be recorded. But it is usually only applicable to several or dozens of pieces of data, otherwise there will be performance problems.", { ns: "${NAMESPACE}" })}}`,
              },
            ],
          },
          default: false,
        },
        filter: {
          ...filter,
          title: `{{t("Only update records matching conditions", { ns: "${NAMESPACE}" })}}`,
          ['x-validator'](value) {
            return isValidFilter(value) ? '' : lang('Please add at least one condition');
          },
        },
        values: {
          ...values,
          'x-component-props': {
            filter(this, field) {
              return this.params?.individualHooks || ![].includes(field.type);
            },
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
    CollectionFieldset,
    IndividualHooksRadioWithTooltip,
  };
}
