import React from 'react';
import { Page, SchemaComponent, SchemaComponentContext, SchemaComponentOptions } from '@tachybase/client';

export const MessagePage = () => {
  return (
    <SchemaComponentContext.Provider value={{ designable: false }}>
      <SchemaComponent
        schema={{
          type: 'void',
          'x-component': 'Page',
          properties: {
            messages: {
              type: 'void',
              'x-decorator': 'MessageBlockProvider',
              'x-acl-action': 'messages:list',
              'x-decorator-props': {
                collection: 'messages',
                action: 'list',
                params: {
                  pageSize: 20,
                },
                rowKey: 'id',
                showIndex: true,
                dragSort: false,
                disableTemplate: true,
              },
              'x-toolbar': 'BlockSchemaToolbar',
              'x-settings': 'blockSettings:table',
              'x-component': 'CardItem',
              'x-filter-targets': [],
              properties: {
                actions: {
                  type: 'void',
                  'x-initializer': 'MessageTable:configureActions',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 'var(--tb-spacing)',
                    },
                  },
                },
                smvxfjqmkl7: {
                  type: 'array',
                  'x-initializer': 'MessageTable:configureColumns',
                  'x-component': 'TableV2',
                  'x-use-component-props': 'useTableBlockProps',
                  'x-component-props': {
                    rowKey: 'id',
                    rowSelection: {
                      type: 'checkbox',
                    },
                  },
                  properties: {
                    actions: {
                      type: 'void',
                      title: '{{ t("Actions") }}',
                      'x-action-column': 'actions',
                      'x-decorator': 'TableV2.Column.ActionBar',
                      'x-component': 'TableV2.Column',
                      'x-component-props': {
                        width: 150,
                        fixed: 'right',
                      },
                      'x-designer': 'TableV2.ActionColumnDesigner',
                      'x-initializer': 'MessageTable:configureItemActions',
                      properties: {
                        he7o0zao83h: {
                          type: 'void',
                          'x-decorator': 'DndContext',
                          'x-component': 'Space',
                          'x-component-props': {
                            split: '|',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }}
      ></SchemaComponent>
    </SchemaComponentContext.Provider>
  );
};
