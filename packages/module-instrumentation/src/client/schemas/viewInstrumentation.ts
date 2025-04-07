import { ISchema } from '@tachybase/schema';

import { clientTrackingCollection } from '../collections/instrumentation.collection';
import { NAMESPACE } from '../locale';

export const viewInstrumentation: ISchema = {
  type: 'void',
  title: '{{ t("View") }}',
  'x-action': 'view',
  'x-component': 'Action.Link',
  'x-component-props': {
    openMode: 'drawer',
  },
  'x-decorator': 'ACLActionProvider',
  properties: {
    drawer: {
      type: 'void',
      title: `{{ t("View instrumentation", { ns: "${NAMESPACE}" }) }}`,
      'x-component': 'Action.Container',
      'x-component-props': {
        openMode: 'drawer',
        className: 'tb-action-popup',
      },
      properties: {
        card: {
          type: 'void',
          'x-acl-action-props': {
            skipScopeCheck: false,
          },
          'x-acl-action': `${clientTrackingCollection.name}:list`,
          'x-decorator': 'FormBlockProvider',
          'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
          'x-decorator-props': {
            action: 'get',
            dataSource: 'main',
            collection: clientTrackingCollection,
          },
          'x-component': 'CardItem',
          properties: {
            form: {
              type: 'void',
              'x-component': 'FormV2',
              'x-use-component-props': 'useEditFormBlockProps',
              properties: {
                // actionBar: {
                //   type: 'void',
                //   'x-component': 'ActionBar',
                //   'x-component-props': {
                //     style: {
                //       marginBottom: 24,
                //     },
                //   },
                //   properties: {
                //     cancel: {
                //       title: '{{ t("Cancel") }}',
                //       'x-component': 'Action',
                //       'x-use-component-props': 'useCancelActionProps',
                //     },
                //   },
                // },
                id: {
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                  'x-read-pretty': true,
                },
                key: {
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                  'x-read-pretty': true,
                },
                type: {
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                  'x-read-pretty': true,
                },
                values: {
                  'x-component': 'CollectionField',
                  'x-decorator': 'FormItem',
                  'x-read-pretty': true,
                  'x-component-props': {
                    style: {
                      height: '300px',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
