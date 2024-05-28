import { useActionContext, useRecord, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';
import { T } from '../others/T';

export const schemaYye = {
  type: 'object',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues(e) {
          const t = useActionContext(),
            o = useRecord();
          return useRequest(
            () => Promise.resolve({ data: { parent: { ...o } } }),
            T({ ...e }, { refreshDeps: [t.visible] }),
          );
        },
      },
      title: '{{t("New sub department")}}',
      properties: {
        title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem' },
        parent: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.parent',
          'x-component-props': { component: 'DepartmentSelect' },
        },
        roles: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.roles',
        },
        footer: {
          type: 'void',
          'x-component': 'Action.Drawer.Footer',
          properties: {
            cancel: {
              title: '{{t("Cancel")}}',
              'x-component': 'Action',
              'x-component-props': { useAction: '{{ cm.useCancelAction }}' },
            },
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': { type: 'primary', useAction: '{{ useCreateDepartment }}' },
            },
          },
        },
      },
    },
  },
};
