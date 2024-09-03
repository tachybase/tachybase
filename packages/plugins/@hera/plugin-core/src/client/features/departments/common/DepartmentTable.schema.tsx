import { uid } from '@tachybase/schema';

export const getSchemaDepartmentTable = (params) => {
  const { useDataSource } = params;

  return {
    type: 'void',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'RequestProvider',
        'x-component-props': {
          useDataSource,
        },
        properties: {
          actions: {
            type: 'void',
            'x-component': 'ActionBar',
            'x-component-props': {
              style: {
                marginBottom: 16,
              },
            },
            properties: {
              filter: {
                type: 'void',
                title: '{{ t("Filter") }}',
                default: {
                  $and: [
                    {
                      title: {
                        $includes: '',
                      },
                    },
                  ],
                },
                'x-action': 'filter',
                'x-component': 'Filter.Action',
                'x-use-component-props': 'useFilterActionProps',
                'x-component-props': {
                  icon: 'FilterOutlined',
                },
                'x-align': 'left',
              },
            },
          },
          departments: {
            type: 'array',
            'x-component': 'InternalDepartmentTable',
            'x-component-props': {
              useDisabled: '{{ useDisabled }}',
            },
          },
        },
      },
    },
  };
};
