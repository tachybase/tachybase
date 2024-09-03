import { useEffect } from 'react';
import { useActionContext, useAPIClient, useRecord, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';

export const schemaDepartmentEdit = {
  type: 'object',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues(options) {
          const API = useAPIClient();
          const ctx = useActionContext();
          const record = useRecord();
          const result = useRequest(
            () =>
              API.resource('departments')
                .get({
                  filterByTk: record.id,
                  appends: ['parent(recursively=true)', 'roles', 'owners'],
                })
                .then((res) => res?.data),
            {
              ...options,
              manual: true,
            },
          );

          useEffect(() => {
            ctx.visible && result.run();
          }, [ctx.visible]);
          return result;
        },
      },
      title: '{{t("Edit department")}}',
      properties: {
        title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem' },
        parent: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.parent',
          'x-component-props': {
            component: 'SuperiorDepartmentSelect',
          },
        },
        roles: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.roles',
        },
        owners: {
          title: '{{t("Owners")}}',
          'x-component': 'DepartmentOwnersField',
          'x-decorator': 'FormItem',
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
                useAction: '{{ useUpdateDepartment }}',
              },
            },
          },
        },
      },
    },
  },
};
