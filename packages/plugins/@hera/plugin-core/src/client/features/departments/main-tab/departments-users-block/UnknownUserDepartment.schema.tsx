export const schemaUnknownUserDepartment = {
  type: 'void',
  properties: {
    drawer: {
      title: '{{t("Select Departments")}}',
      'x-decorator': 'Form',
      'x-component': 'Action.Drawer',
      properties: {
        table: {
          type: 'void',
          'x-decorator': 'FormItem',
          'x-component': 'DepartmentTable',
          'x-component-props': {
            useDataSource: '{{ useDataSource }}',
            useDisabled: '{{ useDisabled }}',
          },
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
            confirm: {
              title: '{{t("Submit")}}',
              'x-component': 'Action',
              'x-component-props': {
                type: 'primary',
                useAction: '{{ useAddDepartments }}',
              },
            },
          },
        },
      },
    },
  },
};
