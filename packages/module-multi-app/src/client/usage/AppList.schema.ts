import React from 'react';
import { SchemaComponentOptions, useActionContext, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { formSchema } from '../base/schemas/schemaForm';

export const appListSchema = {
  type: 'void',
  properties: {
    update: {
      type: 'void',
      'x-component': 'Action',
      'x-component-props': {
        icon: 'editoutlined',
      },
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'Action.Drawer',
          'x-decorator': 'Form',
          'x-decorator-props': {
            useValues: '{{ cm.useValuesFromRecord }}',
          },
          title: '{{t("Edit")}}',
          properties: {
            formSchema,
            footer: {
              type: 'void',
              'x-component': 'Action.Drawer.Footer',
              properties: {
                cancel: {
                  title: '{{t("Cancel")}}',
                  'x-component': 'Action',
                  'x-use-component-props': 'useCancelActionProps',
                },
                submit: {
                  title: '{{t("Submit")}}',
                  'x-action': 'submit',
                  'x-component': 'Action',
                  'x-use-component-props': 'useMultiAppUpdateAction',
                  'x-component-props': {
                    type: 'primary',
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      type: 'void',
      'x-component': 'Action',
      'x-use-component-props': 'useDestroyActionProps',
      'x-component-props': {
        icon: 'deleteoutlined',
        confirm: {
          title: "{{t('Delete')}}",
          content: "{{t('Are you sure you want to delete it?')}}",
        },
      },
    },
  },
};

export const appListActionsSchema = {
  type: 'void',
  'x-component': 'ActionBar',
  'x-component-props': {
    style: {
      marginBottom: 16,
    },
  },
  properties: {
    create: {
      type: 'void',
      title: '{{t("Add new")}}',
      'x-decorator': (props) => React.createElement(SchemaComponentOptions, { ...props, scope: { createOnly: true } }),
      'x-component': 'Action',
      'x-component-props': {
        type: 'primary',
        icon: 'PlusOutlined',
      },
      properties: {
        drawer: {
          type: 'void',
          'x-component': 'Action.Drawer',
          'x-decorator': 'Form',
          'x-decorator-props': {
            useValues(options) {
              const ctx = useActionContext();
              return useRequest(
                () =>
                  Promise.resolve({
                    data: {
                      name: `a_${uid()}`,
                    },
                  }),
                { ...options, refreshDeps: [ctx.visible] },
              );
            },
          },
          title: '{{t("Add new")}}',
          properties: {
            formSchema,
            footer: {
              type: 'void',
              'x-component': 'Action.Drawer.Footer',
              properties: {
                cancel: {
                  title: '{{t("Cancel")}}',
                  'x-component': 'Action',
                  'x-use-component-props': 'useCancelActionProps',
                },
                submit: {
                  title: '{{ t("Submit") }}',
                  'x-component': 'Action',
                  'x-use-component-props': 'useCreateDatabaseConnectionAction',
                  'x-component-props': {
                    type: 'primary',
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
