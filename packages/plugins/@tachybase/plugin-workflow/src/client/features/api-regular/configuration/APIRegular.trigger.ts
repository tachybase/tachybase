import {
  SchemaInitializerItemType,
  useCollectionDataSource,
  useCollectionManager_deprecated,
  useCompile,
} from '@tachybase/client';

import {
  CheckboxGroupWithTooltip,
  CollectionBlockInitializer,
  FieldsSelect,
  getCollectionFieldOptions,
  RadioWithTooltip,
} from '../../..';
import { lang, tval } from '../../../locale';
import { Trigger } from '../../../triggers';

const enum ACTION_TYPES {
  CREATE = 'create',
  UPDATE = 'update',
  UPSERT = 'updateOrCreate',
  DESTROY = 'destroy',
}
export class APIRegularTrigger extends Trigger {
  title = lang('API Regular');
  description = lang('Trigger when an API call is made.');
  fieldset = {
    collection: {
      type: 'string',
      title: tval('Collection'),
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      'x-reactions': [
        {
          target: 'changed',
          effects: ['onFieldValueChange'],
          fulfill: {
            state: {
              value: [],
            },
          },
        },
      ],
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
        {
          dependencies: ['collection', 'global'],
          fulfill: {
            state: {
              visible: '{{!!$deps[0] && !!$deps[1]}}',
            },
          },
        },
      ],
    },
  };

  scope = { useCollectionDataSource };

  components = {
    FieldsSelect: FieldsSelect,
    RadioWithTooltip: RadioWithTooltip,
    CheckboxGroupWithTooltip: CheckboxGroupWithTooltip,
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const langTriggerData = lang('Trigger data');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const langUserSubmittedForm = lang('User submitted action');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const langRoleSubmittedForm = lang('Role of user submitted action');
    const rootFields = [
      {
        collectionName: config.collection,
        name: 'data',
        type: 'hasOne',
        target: config.collection,
        uiSchema: {
          title: langTriggerData,
        },
      },
      {
        collectionName: 'users',
        name: 'user',
        type: 'hasOne',
        target: 'users',
        uiSchema: {
          title: langUserSubmittedForm,
        },
      },
      {
        name: 'roleName',
        uiSchema: {
          title: langRoleSubmittedForm,
        },
      },
    ];
    const result = getCollectionFieldOptions({
      // depth,
      appends: ['data', 'user', ...(config.appends?.map((item) => `data.${item}`) || [])],
      ...options,
      fields: rootFields,
      compile,
      getCollectionFields,
    });
    return result;
  }
  useInitializers(config): SchemaInitializerItemType | null {
    if (!config.collection) {
      return null;
    }

    return {
      name: 'triggerData',
      type: 'item',
      key: 'triggerData',
      title: tval('Trigger data'),
      Component: CollectionBlockInitializer,
      collection: config.collection,
      dataPath: '$context.data',
    };
  }
}
