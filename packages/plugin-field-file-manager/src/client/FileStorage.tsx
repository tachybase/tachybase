import React, { useState } from 'react';
import {
  ActionContext,
  recordBlockInitializers,
  SchemaComponent,
  useCollectionRecordData,
  useCompile,
  usePlugin,
} from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown } from 'antd';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import FileManagerPlugin from '.';
import { collectionFileManager, storageSchema } from './schemas/storage';
import { StorageOptions } from './StorageOptions';

export const CreateStorage = () => {
  const [schema, setSchema] = useState({});
  const plugin = usePlugin(FileManagerPlugin);
  const compile = useCompile();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <div>
      <ActionContext.Provider value={{ visible, setVisible }}>
        <Dropdown
          menu={{
            onClick(info) {
              const storageType = plugin.storageTypes.get(info.key);
              setVisible(true);
              setSchema({
                properties: {
                  [uid()]: {
                    type: 'void',
                    title: compile("{{t('Add new')}}") + ' - ' + compile(storageType.title),
                    'x-component': 'Action.Drawer',
                    properties: {
                      body: {
                        type: 'void',
                        'x-decorator': 'FormBlockProvider',
                        'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
                        'x-decorator-props': {
                          dataSource: 'main',
                          collection: collectionFileManager,
                        },
                        properties: {
                          form: {
                            type: 'void',
                            'x-component': 'FormV2',
                            'x-use-component-props': 'useCreateFormBlockProps',
                            properties: {
                              actionBar: {
                                type: 'void',
                                'x-component': 'ActionBar',
                                'x-component-props': {
                                  style: {
                                    marginBottom: 24,
                                  },
                                },
                                properties: {
                                  cancel: {
                                    title: '{{ t("Cancel") }}',
                                    'x-component': 'Action',
                                    'x-use-component-props': 'useCancelActionProps',
                                  },
                                  submit: {
                                    title: '{{ t("Submit") }}',
                                    'x-component': 'Action',
                                    'x-use-component-props': 'useCreateActionProps',
                                    'x-component-props': {
                                      type: 'primary',
                                      htmlType: 'submit',
                                    },
                                    'x-action-settings': {
                                      assignedValues: { type: storageType.name },
                                    },
                                  },
                                },
                              },
                              ...storageType.properties,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            },
            items: [...plugin.storageTypes.values()].map((storageType) => {
              return {
                key: storageType.name,
                label: compile(storageType.title),
              };
            }),
          }}
        >
          <Button type={'primary'} icon={<PlusOutlined />}>
            {t('Add new')} <DownOutlined />
          </Button>
        </Dropdown>
        <SchemaComponent scope={{ createOnly: true }} schema={schema} />
      </ActionContext.Provider>
    </div>
  );
};

export const EditStorage = () => {
  const record = useCollectionRecordData();
  const [schema, setSchema] = useState({});
  const plugin = usePlugin(FileManagerPlugin);
  const compile = useCompile();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <div>
      <ActionContext.Provider value={{ visible, setVisible }}>
        <a
          onClick={() => {
            setVisible(true);
            const storageType = plugin.storageTypes.get(record.type);
            if (storageType.properties['default']) {
              storageType.properties['default']['x-reactions'] = (field) => {
                if (field.initialValue) {
                  field.disabled = true;
                } else {
                  field.disabled = false;
                }
              };
            }
            setSchema({
              properties: {
                [uid()]: {
                  type: 'void',
                  title: compile("{{t('Edit')}}") + ' - ' + compile(storageType.title),
                  'x-component': 'Action.Drawer',
                  properties: {
                    card: {
                      type: 'void',
                      'x-decorator': 'FormBlockProvider',
                      'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
                      'x-decorator-props': {
                        action: 'get',
                        dataSource: 'main',
                        collection: collectionFileManager,
                      },
                      properties: {
                        form: {
                          type: 'void',
                          'x-component': 'FormV2',
                          'x-use-component-props': 'useEditFormBlockProps',
                          properties: {
                            actionBar: {
                              type: 'void',
                              'x-component': 'ActionBar',
                              'x-component-props': {
                                style: {
                                  marginBottom: 24,
                                },
                              },
                              properties: {
                                cancel: {
                                  title: '{{ t("Cancel") }}',
                                  'x-component': 'Action',
                                  'x-use-component-props': 'useCancelActionProps',
                                },
                                submit: {
                                  title: '{{ t("Submit") }}',
                                  'x-component': 'Action',
                                  'x-use-component-props': 'useUpdateActionProps',
                                  'x-component-props': {
                                    type: 'primary',
                                  },
                                },
                              },
                            },
                            ...storageType.properties,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });
          }}
        >
          {t('Edit')}
        </a>
        <SchemaComponent scope={{ createOnly: false }} schema={schema} />
      </ActionContext.Provider>
    </div>
  );
};

export const FileStoragePane = () => {
  const { t } = useTranslation();
  const compile = useCompile();
  const plugin = usePlugin(FileManagerPlugin);
  const storageTypes = [...plugin.storageTypes.values()].map((storageType) => {
    return {
      value: storageType.name,
      label: compile(storageType.title),
    };
  });
  const xStyleProcessDesc = (
    <div>
      {t('See more')}{' '}
      <a target="_blank" href="https://help.aliyun.com/zh/oss/user-guide/resize-images-4" rel="noreferrer">
        x-oss-process
      </a>
    </div>
  );
  return (
    <SchemaComponent
      components={{ StorageOptions, CreateStorage, EditStorage }}
      scope={{ useNewId: (prefix) => `${prefix}${uid()}`, storageTypes, xStyleProcessDesc }}
      schema={storageSchema}
    />
  );
};
