import React, { createContext, useContext } from 'react';
import {
  ExtendCollectionsProvider,
  FormProvider,
  SchemaComponent,
  TableBlockProvider,
  useCollection_deprecated,
  useCompile,
  useRecord,
} from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';
import { observer, useField } from '@tachybase/schema';

import { tval } from '../locale';
import { MessageDesigner } from './MessageDesigner';

const collection = {
  name: 'messages',
  title: tval('Messages'),
  fields: [
    {
      name: 'createdAt',
      type: 'date',
      interface: 'createdAt',
      uiSchema: {
        type: 'datetime',
        title: tval('Created at'),
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      name: 'type',
      type: 'string',
      interface: 'select',
      uiSchema: {
        type: 'string',
        title: tval('Action type'),
        'x-component': 'Select',
        'x-read-pretty': true,
        enum: [
          { label: tval('Create record'), value: 'create', color: 'lime' },
          { label: tval('Update record'), value: 'update', color: 'gold' },
          { label: tval('Delete record'), value: 'destroy', color: 'magenta' },
        ],
      },
    },
  ],
};

const Username = observer(
  () => {
    const field = useField<any>();
    return <div>{field?.value?.nickname || field.value?.id}</div>;
  },
  { displayName: 'Username' },
);

const Collection = observer(
  () => {
    const field = useField<any>();
    const { title, name } = field.value || {};
    const compile = useCompile();
    return <div>{title ? compile(title) : name}</div>;
  },
  { displayName: 'Collection' },
);

const Field = observer(
  () => {
    const field = useField<any>();
    const compile = useCompile();
    if (!field.value) {
      return null;
    }
    return <div>{field.value?.uiSchema?.title ? compile(field.value?.uiSchema?.title) : field.value.name}</div>;
  },
  { displayName: 'Field' },
);

const Value = observer(
  () => {
    const field = useField<any>();
    const record = ArrayTable.useRecord();
    if (record.field?.uiSchema) {
      return (
        <FormProvider>
          <SchemaComponent
            schema={{
              name: record.field.name,
              ...record.field?.uiSchema,
              default: field.value,
              'x-read-pretty': true,
            }}
          />
        </FormProvider>
      );
    }
    return <div>{field.value ? JSON.stringify(field.value) : null}</div>;
  },
  { displayName: 'Value' },
);

const IsAssociationBlock = createContext(null);
IsAssociationBlock.displayName = 'IsAssociationBlock';

export const Message: any = () => {
  const isAssoc = useContext(IsAssociationBlock);
  const ext = {};
  if (!isAssoc) {
    ext['column31'] = {
      type: 'void',
      'x-component': 'TableV2.Column',
      title: tval('Record ID'),
      properties: {
        recordId: {
          'x-component': 'Input',
          'x-read-pretty': true,
        },
      },
    };
  }
  return (
    <SchemaComponent
      memoized
      components={{ ArrayTable, Username, Collection, Field, Value }}
      schema={{
        type: 'void',
        name: 'lfm4trkw8j3',
        'x-component': 'div',
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
                title: tval('Filter'),
                'x-action': 'filter',
                'x-component': 'Filter.Action',
                'x-component-props': {
                  icon: 'FilterOutlined',
                  useProps: '{{ useFilterActionProps }}',
                },
                'x-align': 'left',
              },
            },
          },
          y84dlntcaup: {
            type: 'array',
            'x-component': 'TableV2',
            'x-component-props': {
              rowKey: 'id',
              rowSelection: {
                type: 'checkbox',
              },
              useProps: '{{ useTableBlockProps }}',
            },
            properties: {
              actions: {
                type: 'void',
                title: tval('Actions'),
                'x-action-column': 'actions',
                'x-decorator': 'TableV2.Column.ActionBar',
                'x-component': 'TableV2.Column',
                'x-designer': 'TableV2.ActionColumnDesigner',
                'x-initializer': 'table:configureItemActions',
                properties: {
                  actions: {
                    type: 'void',
                    'x-decorator': 'DndContext',
                    'x-component': 'Space',
                    'x-component-props': {
                      split: '|',
                    },
                    properties: {
                      o80rypwmeeg: {
                        type: 'void',
                        title: tval('View'),
                        'x-toolbar': 'ActionSchemaToolbar',
                        'x-settings': 'actionSettings:view',
                        'x-component': 'Action.Link',
                        'x-component-props': {
                          openMode: 'drawer',
                        },
                        properties: {
                          drawer: {
                            type: 'void',
                            title: tval('View record'),
                            'x-component': 'Action.Container',
                            'x-component-props': {
                              className: 'nb-action-popup',
                            },
                            properties: {
                              grid: {
                                type: 'void',
                                'x-component': 'Grid',
                                properties: {
                                  tdlav8o9o17: {
                                    type: 'void',
                                    'x-component': 'Grid.Row',
                                    properties: {
                                      '7bsnaf47i6g': {
                                        type: 'void',
                                        'x-component': 'Grid.Col',
                                        properties: {
                                          '6s2qbihe3tu': {
                                            type: 'void',
                                            'x-acl-action': 'Message:get',
                                            'x-decorator': 'FormBlockProvider',
                                            'x-decorator-props': {
                                              resource: 'messages',
                                              collection: 'messages',
                                              readPretty: true,
                                              action: 'get',
                                              params: {
                                                appends: ['collection', 'user', 'changes'],
                                              },
                                              useParams: '{{ useParamsFromRecord }}',
                                              useSourceId: '{{ useSourceIdFromParentRecord }}',
                                            },
                                            'x-component': 'CardItem',
                                            properties: {
                                              mevpuonrda0: {
                                                type: 'void',
                                                'x-component': 'FormV2',
                                                'x-read-pretty': true,
                                                'x-component-props': {
                                                  useProps: '{{ useFormBlockProps }}',
                                                },
                                                properties: {
                                                  grid: {
                                                    type: 'void',
                                                    'x-component': 'Grid',
                                                    properties: {
                                                      row1: {
                                                        type: 'void',
                                                        'x-component': 'Grid.Row',
                                                        properties: {
                                                          col11: {
                                                            type: 'void',
                                                            'x-component': 'Grid.Col',
                                                            properties: {
                                                              collection: {
                                                                type: 'string',
                                                                title: tval('Collection display name'),
                                                                'x-component': 'Collection',
                                                                'x-decorator': 'FormItem',
                                                                'x-read-pretty': true,
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                      row2: {
                                                        type: 'void',
                                                        'x-component': 'Grid.Row',
                                                        properties: {
                                                          col21: {
                                                            type: 'void',
                                                            'x-component': 'Grid.Col',
                                                            properties: {
                                                              type: {
                                                                type: 'string',
                                                                'x-component': 'CollectionField',
                                                                'x-decorator': 'FormItem',
                                                                'x-read-pretty': true,
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                      row3: {
                                                        type: 'void',
                                                        'x-component': 'Grid.Row',
                                                        properties: {
                                                          col31: {
                                                            type: 'void',
                                                            'x-component': 'Grid.Col',
                                                            properties: {
                                                              createdAt: {
                                                                type: 'string',
                                                                'x-component': 'CollectionField',
                                                                'x-decorator': 'FormItem',
                                                                'x-read-pretty': true,
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                      row4: {
                                                        type: 'void',
                                                        'x-component': 'Grid.Row',
                                                        properties: {
                                                          col41: {
                                                            type: 'void',
                                                            'x-component': 'Grid.Col',
                                                            properties: {
                                                              user: {
                                                                type: 'string',
                                                                title: tval('User'),
                                                                'x-component': 'Username',
                                                                'x-decorator': 'FormItem',
                                                                'x-read-pretty': true,
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                      row5: {
                                                        type: 'void',
                                                        'x-component': 'Grid.Row',
                                                        properties: {
                                                          col51: {
                                                            type: 'void',
                                                            'x-component': 'Grid.Col',
                                                            properties: {
                                                              changes: {
                                                                type: 'array',
                                                                title: tval('Field value changes'),
                                                                'x-decorator': 'FormItem',
                                                                'x-component': 'ArrayTable',
                                                                'x-component-props': {
                                                                  pagination: { pageSize: 10 },
                                                                  scroll: { x: '100%' },
                                                                },
                                                                items: {
                                                                  type: 'object',
                                                                  properties: {
                                                                    column3: {
                                                                      type: 'void',
                                                                      'x-component': 'ArrayTable.Column',
                                                                      'x-component-props': {
                                                                        width: 200,
                                                                        title: tval('Field'),
                                                                      },
                                                                      properties: {
                                                                        field: {
                                                                          type: 'string',
                                                                          //'x-decorator': 'Editable',
                                                                          'x-component': 'Field',
                                                                        },
                                                                      },
                                                                    },
                                                                    column4: {
                                                                      type: 'void',
                                                                      'x-component': 'ArrayTable.Column',
                                                                      'x-component-props': {
                                                                        width: 200,
                                                                        title: tval('Before change'),
                                                                      },
                                                                      properties: {
                                                                        before: {
                                                                          type: 'string',
                                                                          'x-decorator': 'FormItem',
                                                                          'x-component': 'Value',
                                                                        },
                                                                      },
                                                                    },
                                                                    column5: {
                                                                      type: 'void',
                                                                      'x-component': 'ArrayTable.Column',
                                                                      'x-component-props': {
                                                                        width: 200,
                                                                        title: tval('After change'),
                                                                      },
                                                                      properties: {
                                                                        after: {
                                                                          type: 'string',
                                                                          'x-decorator': 'FormItem',
                                                                          'x-component': 'Value',
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
              column1: {
                type: 'void',
                'x-decorator': 'TableV2.Column.Decorator',
                'x-component': 'TableV2.Column',
                properties: {
                  createdAt: {
                    'x-component': 'CollectionField',
                    'x-read-pretty': true,
                  },
                },
              },
              column2: {
                type: 'void',
                'x-decorator': 'TableV2.Column.Decorator',
                'x-component': 'TableV2.Column',
                properties: {
                  type: {
                    'x-component': 'CollectionField',
                    'x-read-pretty': true,
                  },
                },
              },
              column3: {
                type: 'void',
                'x-component': 'TableV2.Column',
                title: tval('Collection display name'),
                properties: {
                  collection: {
                    'x-component': 'Collection',
                    'x-read-pretty': true,
                  },
                },
              },
              ...ext,
              column4: {
                type: 'void',
                'x-component': 'TableV2.Column',
                title: tval('User'),
                properties: {
                  user: {
                    'x-component': 'Username',
                    'x-read-pretty': true,
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
};

Message.Decorator = observer(
  (props: any) => {
    const parent = useCollection_deprecated();
    const record = useRecord();
    let filter = props?.params?.filter;
    if (parent.name) {
      const filterByTk = record?.[parent.filterTargetKey || 'id'];
      if (filter) {
        filter = {
          $and: [
            filter,
            {
              collectionName: parent.name,
              recordId: `${filterByTk}`,
            },
          ],
        };
      } else {
        filter = {
          collectionName: parent.name,
          recordId: `${filterByTk}`,
        };
      }
    }
    const defaults = {
      collection: 'messages',
      resource: 'messages',
      action: 'list',
      params: {
        pageSize: 20,
        appends: ['collection', 'user'],
        ...props.params,
        filter,
        sort: '-createdAt',
      },
      rowKey: 'id',
      showIndex: true,
      dragSort: false,
    };
    return (
      <IsAssociationBlock.Provider value={!!parent.name}>
        <ExtendCollectionsProvider collections={[collection]}>
          <TableBlockProvider {...defaults}>{props.children}</TableBlockProvider>
        </ExtendCollectionsProvider>
      </IsAssociationBlock.Provider>
    );
  },
  { displayName: 'Message.Decorator' },
);

Message.Designer = MessageDesigner;
