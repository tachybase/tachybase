import { useAPIClient, useActionContext, useRecord, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';
import { useEffect } from 'react';
import { T } from '../others/T';

export const schemaHhe = {
  type: 'object',
  properties: {
    [uid()]: {
      type: 'void',
      'x-component': 'Action.Drawer',
      'x-decorator': 'Form',
      'x-decorator-props': {
        useValues(e) {
          const t = useAPIClient(),
            o = useActionContext(),
            a = useRecord(),
            r = useRequest(
              () =>
                t
                  .resource('departments')
                  .get({ filterByTk: a.id, appends: ['parent(recursively=true)', 'roles', 'owners'] })
                  .then((c) => (c == null ? void 0 : c.data)),
              T({ ...e }, { manual: true }),
            );
          return (
            useEffect(() => {
              o.visible && r.run();
            }, [o.visible]),
            r
          );
        },
      },
      title: '{{t("Edit department")}}',
      properties: {
        title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem' },
        parent: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.parent',
          'x-component-props': { component: 'SuperiorDepartmentSelect' },
        },
        roles: {
          'x-component': 'CollectionField',
          'x-decorator': 'FormItem',
          'x-collection-field': 'departments.roles',
        },
        owners: { title: '{{t("Owners")}}', 'x-component': 'DepartmentOwnersField', 'x-decorator': 'FormItem' },
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
              'x-component-props': { type: 'primary', useAction: '{{ useUpdateDepartment }}' },
            },
          },
        },
      },
    },
  },
};
