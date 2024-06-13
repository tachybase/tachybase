import { useCollectionDataSource, useCollectionManager_deprecated, useCompile } from '@tachybase/client';

import { CheckboxGroupWithTooltip, CollectionBlockInitializer, FieldsSelect, RadioWithTooltip } from '../../components';
import { lang, tval } from '../../locale';
import { Trigger } from '../../triggers';
import { getCollectionFieldOptions } from '../../variable';

const enum ACTION_TYPES {
  CREATE = 'create',
  UPDATE = 'update',
  UPSERT = 'updateOrCreate',
  DESTROY = 'destroy',
}

function useItems(item, options) {
  const compile = useCompile();
  const { getCollectionFields } = useCollectionManager_deprecated();
  return [
    { label: lang('ID'), value: 'filterByTk' },
    ...(item.action !== ACTION_TYPES.DESTROY
      ? [
          {
            label: lang('Values submitted'),
            value: 'values',
            children: getCollectionFieldOptions({
              ...options,
              appends: null,
              depth: 3,
              collection: item.collection,
              compile,
              getCollectionFields,
            }),
          },
        ]
      : []),
  ];
}
export class WorkflowTriggerInterceptor extends Trigger {
  sync = true;
  title = lang('Pre-action event');
  description = lang(
    'Triggered before the execution of a request initiated through an action button or API, such as before adding, updating, or deleting data. Suitable for data validation and logic judgment before action, and the request could be rejected by using the "End process" node.',
  );
  fieldset = {
    collection: {
      type: 'string',
      title: tval('Collection'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      'x-reactions': [{ target: 'changed', effects: ['onFieldValueChange'], fulfill: { state: { value: [] } } }],
    },
    global: {
      type: 'boolean',
      title: tval('Trigger mode'),
      'x-decorator': 'FormItem',
      'x-component': 'RadioWithTooltip',
      'x-component-props': {
        direction: 'vertical',
        options: [
          {
            label: tval('Local mode, triggered before executing the actions bound to this workflow'),
            value: false,
          },
          {
            label: tval('Global mode, triggered before executing the following actions'),
            value: true,
          },
        ],
      },
      default: false,
    },
    actions: {
      type: 'number',
      title: tval('Select actions'),
      'x-decorator': 'FormItem',
      'x-component': 'CheckboxGroupWithTooltip',
      'x-component-props': {
        direction: 'vertical',
        options: [
          { label: tval('Create record action'), value: ACTION_TYPES.CREATE },
          { label: tval('Update record action'), value: ACTION_TYPES.UPDATE },
          { label: tval('Delete record action'), value: ACTION_TYPES.DESTROY },
        ],
      },
      required: true,
      'x-reactions': [
        { dependencies: ['collection', 'global'], fulfill: { state: { visible: '{{!!$deps[0] && !!$deps[1]}}' } } },
      ],
    },
  };
  scope = { useCollectionDataSource };
  components = {
    FieldsSelect,
    RadioWithTooltip,
    CheckboxGroupWithTooltip,
  };
  isActionTriggerable = (config, context) => {
    const { global } = config;
    return !global && !context.direct;
  };

  useVariables(config, options) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields } = useCollectionManager_deprecated();
    const result = getCollectionFieldOptions({
      appends: ['user'],
      ...options,
      fields: [
        {
          collectionName: 'users',
          name: 'user',
          type: 'hasOne',
          target: 'users',
          uiSchema: { title: tval('User acted') },
        },
      ],
      compile,
      getCollectionFields,
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const parametersSchema = [{ label: lang('Parameters'), value: 'params', children: useItems(config, options) }];
    return [...result, { label: lang('Role of user acted'), value: 'roleName' }, ...parametersSchema];
  }
  useInitializers(item) {
    return item.collection
      ? {
          name: 'triggerData',
          type: 'item',
          key: 'triggerData',
          title: tval('Trigger data'),
          Component: CollectionBlockInitializer,
          collection: item.collection,
          dataPath: '$context.params.values',
        }
      : null;
  }
}
