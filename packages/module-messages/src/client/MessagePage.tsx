import React from 'react';
import { Page, SchemaComponent, SchemaComponentContext, SchemaComponentOptions } from '@tachybase/client';

import { tval } from './locale';
import { setMessageDeleteDisabled, setMessageUid } from './MessageProvider';

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
                  sort: ['-createdAt'],
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
                  _isJSONSchemaObject: true,
                  version: '2.0',
                  type: 'void',
                  'x-initializer': 'MessageTable:configureActions',
                  'x-component': 'ActionBar',
                  'x-component-props': {
                    style: {
                      marginBottom: 'var(--tb-spacing)',
                    },
                  },
                  properties: {
                    s9s829kbpth: {
                      _isJSONSchemaObject: true,
                      version: '2.0',
                      type: 'void',
                      title: '{{ t("Filter") }}',
                      'x-action': 'filter',
                      'x-toolbar': 'ActionSchemaToolbar',
                      'x-settings': 'actionSettings:filter',
                      'x-component': 'Filter.Action',
                      'x-use-component-props': 'useFilterActionProps',
                      'x-component-props': {
                        icon: 'FilterOutlined',
                      },
                      'x-align': 'left',
                      'x-uid': 'd00mxjosic8',
                      'x-async': false,
                      'x-index': 1,
                    },
                    o67reslgf2r: {
                      _isJSONSchemaObject: true,
                      version: '2.0',
                      title: '{{ t("Refresh") }}',
                      'x-action': 'refresh',
                      'x-component': 'Action',
                      'x-use-component-props': 'useRefreshActionProps',
                      'x-toolbar': 'ActionSchemaToolbar',
                      'x-settings': 'actionSettings:refresh',
                      'x-component-props': {
                        icon: 'ReloadOutlined',
                      },
                      'x-align': 'right',
                      type: 'void',
                      'x-uid': 'xtxvhu48ndt',
                      'x-async': false,
                      'x-index': 2,
                    },
                    qu313t3mhve: {
                      _isJSONSchemaObject: true,
                      version: '2.0',
                      title: '{{ t("Delete") }}',
                      'x-action': 'destroy',
                      'x-component': 'Action',
                      'x-toolbar': 'ActionSchemaToolbar',
                      'x-settings': 'actionSettings:bulkDelete',
                      'x-decorator': 'ACLActionProvider',
                      'x-acl-action-props': {
                        skipScopeCheck: true,
                      },
                      'x-use-component-props': 'useBulkDestroyActionProps',
                      'x-component-props': {
                        icon: 'DeleteOutlined',
                        confirm: {
                          title: "{{t('Delete record')}}",
                          content: "{{t('Are you sure you want to delete it?')}}",
                        },
                      },
                      'x-action-settings': {
                        triggerWorkflows: [],
                      },
                      'x-acl-action': 'messages:destroy',
                      'x-align': 'right',
                      type: 'void',
                      'x-uid': '8d04gjfabdr',
                      'x-async': false,
                      'x-index': 3,
                    },
                  },
                  'x-uid': '1l4ilxn05v4',
                  'x-async': false,
                  'x-index': 1,
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
                        '39nl8hxmit5': {
                          _isJSONSchemaObject: true,
                          version: '2.0',
                          type: 'void',
                          'x-decorator': 'DndContext',
                          'x-component': 'Space',
                          'x-component-props': {
                            split: '|',
                          },
                          properties: {
                            glylp3vdps9: {
                              _isJSONSchemaObject: true,
                              version: '2.0',
                              type: 'void',
                              title: '{{t("View", {"ns":["messages","client"]})}}',
                              'x-action': 'view',
                              'x-toolbar': 'ActionSchemaToolbar',
                              'x-settings': 'actionSettings:view',
                              'x-component': 'Action.Link',
                              'x-component-props': {
                                openMode: 'drawer',
                              },
                              'x-decorator': 'ACLActionProvider',
                              properties: {
                                drawer: {
                                  _isJSONSchemaObject: true,
                                  version: '2.0',
                                  type: 'void',
                                  title: '{{t("View record", {"ns":["messages","client"]})}}',
                                  'x-component': 'Action.Container',
                                  'x-component-props': {
                                    className: 'tb-action-popup',
                                  },
                                  properties: {
                                    tabs: {
                                      _isJSONSchemaObject: true,
                                      version: '2.0',
                                      type: 'void',
                                      'x-component': 'Tabs',
                                      'x-component-props': {},
                                      properties: {
                                        tab1: {
                                          _isJSONSchemaObject: true,
                                          version: '2.0',
                                          type: 'void',
                                          title: '{{t("Details", {"ns":["messages","client"]})}}',
                                          'x-component': 'Tabs.TabPane',
                                          'x-designer': 'Tabs.Designer',
                                          'x-component-props': {},
                                          properties: {
                                            schemaName: {
                                              _isJSONSchemaObject: true,
                                              version: '2.0',
                                              type: 'void',
                                              'x-decorator': 'SchemaComponentContextProvider',
                                              'x-decorator-props': {
                                                designable: false,
                                              },
                                              'x-component': 'MessageSchemaComponent',
                                              'x-component-props': {
                                                noForm: true,
                                              },
                                              'x-reactions': setMessageUid,
                                              'x-async': false,
                                              'x-index': 1,
                                            },
                                          },
                                          'x-uid': '9r5uf5bbd8o',
                                          'x-async': false,
                                          'x-index': 1,
                                        },
                                      },
                                      'x-uid': 'g04dfyfl52q',
                                      'x-async': false,
                                      'x-index': 1,
                                    },
                                  },
                                  'x-uid': '1cgf8gc7ave',
                                  'x-async': false,
                                  'x-index': 1,
                                },
                              },
                              'x-uid': 'lr9jedjpohg',
                              'x-async': false,
                              'x-index': 1,
                            },
                            u724qv19al4: {
                              _isJSONSchemaObject: true,
                              version: '2.0',
                              title: '{{ t("Delete") }}',
                              'x-action': 'destroy',
                              'x-component': 'Action.Link',
                              'x-use-component-props': 'useDestroyActionProps',
                              'x-toolbar': 'ActionSchemaToolbar',
                              'x-settings': 'actionSettings:delete',
                              'x-component-props': {
                                icon: 'DeleteOutlined',
                                confirm: {
                                  title: "{{t('Delete record')}}",
                                  content: "{{t('Are you sure you want to delete it?')}}",
                                },
                              },
                              'x-action-settings': {
                                triggerWorkflows: [],
                              },
                              'x-decorator': 'ACLActionProvider',
                              'x-reactions': setMessageDeleteDisabled,
                              type: 'void',
                              'x-uid': 'xnoxn8oa7v6',
                              'x-async': false,
                              'x-index': 6,
                            },
                          },
                          'x-uid': 'lj2dd0tkj9x',
                          'x-async': false,
                          'x-index': 1,
                        },
                      },
                    },
                    createdAt: {
                      type: 'void',
                      'x-decorator': 'TableV2.Column.Decorator',
                      'x-component': 'TableV2.Column',
                      title: tval('Created at'),
                      properties: {
                        createdAt: {
                          type: 'datetime',
                          'x-component': 'DatePicker',
                          'x-component-props': {
                            showTime: true,
                          },
                          'x-read-pretty': true,
                        },
                      },
                    },
                    title: {
                      type: 'void',
                      'x-decorator': 'TableV2.Column.Decorator',
                      'x-component': 'TableV2.Column',
                      title: tval('Title'),
                      properties: {
                        title: {
                          type: 'string',
                          'x-component': 'CollectionField',
                          'x-read-pretty': true,
                        },
                      },
                    },
                    content: {
                      type: 'void',
                      'x-decorator': 'TableV2.Column.Decorator',
                      'x-component': 'TableV2.Column',
                      title: tval('Content'),
                      properties: {
                        content: {
                          type: 'string',
                          'x-component': 'CollectionField',
                          'x-read-pretty': true,
                        },
                      },
                    },
                    read: {
                      type: 'void',
                      'x-decorator': 'TableV2.Column.Decorator',
                      'x-component': 'TableV2.Column',
                      title: tval('Read'),
                      properties: {
                        read: {
                          type: 'boolean',
                          'x-component': 'CollectionField',
                          'x-read-pretty': true,
                          'x-component-props': { showUnchecked: true },
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
