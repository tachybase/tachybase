import { useActionContext, useRecord, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';

/**
 * 新增子部门表单
 */
export const schemaDepartmentNewSub = {
  type: 'object',
  properties: {
    [uid()]: {
      title: '{{t("New sub department")}}',
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues(options) {
          const ctx = useActionContext();
          const record = useRecord();
          return useRequest(
            () =>
              Promise.resolve({
                data: {
                  parent: { ...record },
                },
              }),
            {
              ...options,
              refreshDeps: [ctx.visible],
            },
          );
        },
      },
      properties: {
        title: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
        },
        parent: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.parent',
          'x-component-props': {
            component: 'DepartmentSelect',
          },
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
              'x-component-props': {
                useAction: '{{ cm.useCancelAction }}',
              },
            },
            submit: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useCreateDepartment }}',
              },
            },
          },
        },
      },
    },
  },
};
