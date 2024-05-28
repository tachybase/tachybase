import { SchemaComponent } from '@tachybase/client';
import { uid } from '@tachybase/schema';
import { jsx } from 'react/jsx-runtime';
import { useFilterActionPropsXe } from '../scopes/useFilterActionPropsXe';
import { InternalDepartmentTableRe } from './InternalDepartmentTableRe';
import { RequestProviderEet } from './RequestProviderEet';

export const DepartmentTablePpe = ({ useDataSource: e, useDisabled: t }) =>
  jsx(SchemaComponent, {
    scope: {
      useDisabled: t,
      useFilterActionProps: useFilterActionPropsXe,
    },
    components: {
      InternalDepartmentTable: InternalDepartmentTableRe,
      RequestProvider: RequestProviderEet,
    },
    schema: {
      type: 'void',
      properties: {
        [uid()]: {
          type: 'void',
          'x-component': 'RequestProvider',
          'x-component-props': { useDataSource: e },
          properties: {
            actions: {
              type: 'void',
              'x-component': 'ActionBar',
              'x-component-props': { style: { marginBottom: 16 } },
              properties: {
                filter: {
                  type: 'void',
                  title: '{{ t("Filter") }}',
                  default: { $and: [{ title: { $includes: '' } }] },
                  'x-action': 'filter',
                  'x-component': 'Filter.Action',
                  'x-use-component-props': 'useFilterActionProps',
                  'x-component-props': { icon: 'FilterOutlined' },
                  'x-align': 'left',
                },
              },
            },
            departments: {
              type: 'array',
              'x-component': 'InternalDepartmentTable',
              'x-component-props': { useDisabled: '{{ useDisabled }}' },
            },
          },
        },
      },
    },
  });
