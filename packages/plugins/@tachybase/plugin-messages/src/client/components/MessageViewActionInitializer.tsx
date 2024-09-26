import React from 'react';
import { ActionInitializer } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { tval } from '../locale';

export const MessageViewActionInitializer = () => {
  const changes = {
    type: 'string',
    'x-component': 'AssociationField',
    'x-decorator': 'FormItem',
    'x-collection-field': 'Message.changes',
    'x-read-pretty': true,
    'x-component-props': {
      multiple: true,
      fieldNames: {
        value: 'id',
        label: 'id',
      },
      mode: 'SubTable',
    },
    properties: {
      block: {
        type: 'void',
        'x-component': 'AssociationField.SubTable',
        properties: {
          [uid()]: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            properties: {},
          },
          [uid()]: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            properties: {},
          },
          [uid()]: {
            type: 'void',
            'x-decorator': 'TableV2.Column.Decorator',
            'x-component': 'TableV2.Column',
            properties: {},
          },
        },
      },
    },
  };
  const schema = {
    type: 'void',
    title: tval('View'),
    'x-action': 'view',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:view',
    'x-component': 'Action',
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
          tabs: {
            type: 'void',
            'x-component': 'Tabs',
            'x-component-props': {},
            properties: {
              tab1: {
                type: 'void',
                title: tval('Details'),
                'x-component': 'Tabs.TabPane',
                'x-designer': 'Tabs.Designer',
                'x-component-props': {},
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'Grid',
                    properties: {
                      '7ypqrxaqysp': {
                        type: 'void',
                        'x-component': 'Grid.Row',
                        properties: {
                          '1fc2l8dwe7m': {
                            type: 'void',
                            'x-component': 'Grid.Col',
                            properties: {
                              '5ley6xifrsb': {
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
                                  bv710pbf9w6: {
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
                                          g4c24abnbd9: {
                                            type: 'void',
                                            'x-component': 'Grid.Row',
                                            properties: {
                                              fkt9dj5lu1k: {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  createdAt: {
                                                    type: 'string',
                                                    'x-component': 'CollectionField',
                                                    'x-decorator': 'FormItem',
                                                    'x-collection-field': 'Message.createdAt',
                                                    'x-component-props': {},
                                                    'x-read-pretty': true,
                                                  },
                                                },
                                              },
                                            },
                                          },
                                          l267bkv423v: {
                                            type: 'void',
                                            'x-component': 'Grid.Row',
                                            properties: {
                                              tehaepm5xqy: {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  type: {
                                                    type: 'string',
                                                    'x-component': 'CollectionField',
                                                    'x-decorator': 'FormItem',
                                                    'x-collection-field': 'Message.type',
                                                    'x-component-props': {},
                                                    'x-read-pretty': true,
                                                  },
                                                },
                                              },
                                            },
                                          },
                                          zhmn2tkzdh2: {
                                            type: 'void',
                                            'x-component': 'Grid.Row',
                                            properties: {
                                              yuwyej17i64: {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  recordId: {
                                                    type: 'string',
                                                    'x-component': 'CollectionField',
                                                    'x-decorator': 'FormItem',
                                                    'x-collection-field': 'Message.recordId',
                                                    'x-component-props': {},
                                                  },
                                                },
                                              },
                                            },
                                          },
                                          '6q933ic06mj': {
                                            type: 'void',
                                            'x-component': 'Grid.Row',
                                            properties: {
                                              nwtbkqd99zl2: {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  'collection.title': {
                                                    type: 'string',
                                                    'x-component': 'CollectionField',
                                                    'x-decorator': 'FormItem',
                                                    'x-collection-field': 'Message.collection.title',
                                                    'x-component-props': {},
                                                  },
                                                },
                                              },
                                              nwtbkqd99zl1: {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  'collection.name': {
                                                    type: 'string',
                                                    'x-component': 'CollectionField',
                                                    'x-decorator': 'FormItem',
                                                    'x-collection-field': 'Message.collection.name',
                                                    'x-component-props': {},
                                                  },
                                                },
                                              },
                                            },
                                          },
                                          xd4kzulndqk: {
                                            type: 'void',
                                            'x-component': 'Grid.Row',
                                            properties: {
                                              k3sd72n83zd: {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  user: {
                                                    type: 'string',
                                                    'x-component': 'CollectionField',
                                                    'x-decorator': 'FormItem',
                                                    'x-collection-field': 'Message.user',
                                                    'x-component-props': {},
                                                    'x-read-pretty': true,
                                                    properties: {
                                                      viewer: {
                                                        type: 'void',
                                                        title: tval('View record'),
                                                        'x-component': 'RecordPicker.Viewer',
                                                        'x-component-props': {
                                                          className: 'nb-action-popup',
                                                        },
                                                        properties: {
                                                          tabs: {
                                                            type: 'void',
                                                            'x-component': 'Tabs',
                                                            'x-component-props': {},
                                                            'x-initializer': 'TabPaneInitializers',
                                                            properties: {
                                                              tab1: {
                                                                type: 'void',
                                                                title: tval('Details'),
                                                                'x-component': 'Tabs.TabPane',
                                                                'x-designer': 'Tabs.Designer',
                                                                'x-component-props': {},
                                                                properties: {
                                                                  grid: {
                                                                    type: 'void',
                                                                    'x-component': 'Grid',
                                                                    'x-initializer': 'popup:common:addBlock',
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
                                          '3lghgclbtcg': {
                                            type: 'void',
                                            'x-component': 'Grid.Row',
                                            properties: {
                                              '8l1v1auwlx0': {
                                                type: 'void',
                                                'x-component': 'Grid.Col',
                                                properties: {
                                                  changes,
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
  };
  return <ActionInitializer schema={schema} />;
};
