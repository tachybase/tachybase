/**
 * title: 勾选
 */
import { ISchema } from '@tachybase/schema';
import {
  APIClientProvider,
  Action,
  ActionBar,
  Application,
  BlockItem,
  CollectionField,
  CurrentUserProvider,
  FormItem,
  Input,
  RecordPicker,
  SchemaComponent,
  SchemaComponentProvider,
  TableSelectorProvider,
  TableV2,
} from '@tachybase/client';
import React from 'react';
import { mockAPIClient } from '../../../../testUtils';
import data from './mockData';

const { apiClient, mockRequest } = mockAPIClient();

mockRequest.onGet('/auth:check').reply(() => {
  return [200, { data: {} }];
});
mockRequest.onGet('/tt_bd_range:list').reply(({ params }) => {
  // 已选中的 id
  const ids = JSON.parse(params.filter).$and?.[0]?.['id.$ne'] || [];

  return [
    200,
    {
      ...data,
      data: data.data.filter((item: any) => !ids.includes(item.id)),
    },
  ];
});

const schema: ISchema = {
  type: 'object',
  properties: {
    input: {
      type: 'array',
      title: `编辑模式`,
      'x-decorator': 'FormItem',
      'x-component': 'RecordPicker',
      'x-component-props': {
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        multiple: true,
        association: {
          target: 'tt_bd_range',
        },
      },
      'x-reactions': {
        target: 'read',
        fulfill: {
          state: {
            value: '{{$self.value}}',
          },
        },
      },
      properties: {
        selector: {
          type: 'void',
          title: '{{ t("Select record") }}',
          'x-component': 'RecordPicker.Selector',
          'x-component-props': {
            className: 'nb-record-picker-selector',
          },
          properties: {
            tableBlock: {
              type: 'void',
              'x-decorator': 'TableSelectorProvider',
              'x-decorator-props': {
                collection: 'tt_bd_range',
                resource: 'tt_bd_range',
                action: 'list',
                params: {
                  pageSize: 20,
                },
                rowKey: 'id',
              },
              'x-component': 'BlockItem',
              properties: {
                value: {
                  type: 'array',
                  'x-component': 'TableV2.Selector',
                  'x-use-component-props': 'useTableSelectorProps',
                  'x-component-props': {
                    rowKey: 'id',
                    rowSelection: {
                      type: 'checkbox',
                    },
                  },
                  properties: {
                    column1: {
                      type: 'void',
                      'x-decorator': 'TableV2.Column.Decorator',
                      'x-component': 'TableV2.Column',
                      properties: {
                        name: {
                          type: 'string',
                          'x-component': 'CollectionField',
                          'x-read-pretty': true,
                        },
                      },
                    },
                  },
                },
              },
            },
            footer: {
              'x-component': 'Action.Container.Footer',
              'x-component-props': {},
              properties: {
                actions: {
                  type: 'void',
                  'x-component': 'ActionBar',
                  'x-component-props': {},
                  properties: {
                    submit: {
                      title: '{{ t("Submit") }}',
                      'x-action': 'submit',
                      'x-component': 'Action',
                      'x-use-component-props': 'usePickActionProps',
                      'x-component-props': {
                        type: 'primary',
                        htmlType: 'submit',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    read: {
      type: 'array',
      title: `阅读模式`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'RecordPicker',
      'x-component-props': {
        mode: 'tags',
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
      'x-collection-field': 'tt_mnt_org.range',
    },
  },
};

const Root = () => {
  const components = {
    TableSelectorProvider,
    TableV2,
    CollectionField,
    BlockItem,
    Input,
    RecordPicker,
    FormItem,
    Action,
    ActionBar,
  };

  return (
    <APIClientProvider apiClient={apiClient}>
      <CurrentUserProvider>
        <SchemaComponentProvider components={components}>
          <SchemaComponent schema={schema} />
        </SchemaComponentProvider>
      </CurrentUserProvider>
    </APIClientProvider>
  );
};

const app = new Application({
  providers: [Root],
});

export default app.getRootComponent();
