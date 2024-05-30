import { SchemaComponent } from '@tachybase/client';

import { jsx } from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';

export const ComponentXxe = () => {
  const { t: e } = useTranslation();
  return jsx(SchemaComponent, {
    scope: { t: e },
    schema: {
      type: 'void',
      properties: {
        newDepartment: {
          type: 'void',
          title: e('New department'),
          'x-component': 'Action',
          'x-component-props': { type: 'text', icon: 'PlusOutlined', style: { width: '100%', textAlign: 'left' } },
          properties: {
            drawer: {
              type: 'void',
              'x-component': 'Action.Drawer',
              'x-decorator': 'Form',
              title: e('New department'),
              properties: {
                title: { 'x-component': 'CollectionField', 'x-decorator': 'FormItem', required: true },
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
        },
      },
    },
  });
};
