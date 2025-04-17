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
