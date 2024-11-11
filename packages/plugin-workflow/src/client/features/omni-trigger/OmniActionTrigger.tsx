import { useCollectionDataSource, useCollectionManager_deprecated, useCompile } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { CollectionBlockInitializer } from '../../components';
import { lang, tval } from '../../locale';
import { Trigger } from '../../triggers';
import { getCollectionFieldOptions, UseVariableOptions } from '../../variable';

export class OmniActionTrigger extends Trigger {
  title = tval('General event');
  description = tval(
    `Omni Trigger is a versatile trigger. You can use it to trigger workflows in a table, trigger it from another workflow, or trigger it with a form button.`,
  );
  fieldset = {
    bindCollection: {
      type: 'boolean',
      title: tval('Bind collection?'),
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: tval('Yes'), value: true },
        { label: tval('No'), value: false },
      ],
      required: true,
      default: false,
    },
    collection: {
      type: 'string',
      title: tval('Collection'),
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      required: true,
      'x-reactions': [
        { target: 'changed', effects: ['onFieldValueChange'], fulfill: { state: { value: [] } } },
        { dependencies: ['bindCollection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } },
      ],
    },
    appends: {
      type: 'array',
      title: tval('Associations to use'),
      description: tval(
        'Please select the associated fields that need to be accessed in subsequent nodes. With more than two levels of to-many associations may cause performance issue, please use with caution.',
      ),
      'x-decorator': 'FormItem',
      'x-component': 'AppendsTreeSelect',
      'x-component-props': {
        multiple: true,
        useCollection() {
          const form = useForm();
          return form.values?.collection;
        },
      },
      'x-reactions': [{ dependencies: ['collection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } }],
    },
  };
  scope = { useCollectionDataSource };
  components = {};
  isActionTriggerable = (config, context: any = {}) => {
    const { buttonAction } = context;
    const conditionList = [buttonAction === 'customize:triggerWorkflows', buttonAction === 'submit'];
    const isAvailable = conditionList.some((val) => val === true);
    return isAvailable;
  };
  useVariables(config: Record<string, any>, options?: UseVariableOptions) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields } = useCollectionManager_deprecated();
    const fieldOptions = getCollectionFieldOptions({
      appends: ['user'],
      ...options,
      fields: [
        {
          collectionName: 'users',
          name: 'user',
          type: 'hasOne',
          target: 'users',
          uiSchema: { title: lang('User acted') },
        },
      ],
      compile,
      getCollectionFields,
    });
    return [
      ...getCollectionFieldOptions({
        appends: ['data', ...(config.appends?.map((append) => `data.${append}`) || [])],
        fields: [
          {
            collectionName: config.collection,
            name: 'data',
            type: 'hasOne',
            target: config.collection,
            uiSchema: { title: lang('Trigger data') },
          },
        ],
        compile,
        getCollectionFields,
      }),
      ...fieldOptions,
      { label: lang('Role of user acted'), value: 'roleName' },
    ];
  }
  useInitializers(config) {
    return config.collection
      ? {
          name: 'triggerData',
          type: 'item',
          key: 'triggerData',
          title: tval('Trigger data'),
          Component: CollectionBlockInitializer,
          collection: config.collection,
          dataPath: '$context.data',
        }
      : null;
  }
}
