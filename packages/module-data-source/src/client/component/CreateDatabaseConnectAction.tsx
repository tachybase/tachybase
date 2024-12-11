import React, { useState } from 'react';
import {
  ActionContext,
  SchemaComponent,
  useAPIClient,
  useCancelActionProps,
  useCompile,
  usePlugin,
} from '@tachybase/client';
import { createForm, uid } from '@tachybase/schema';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Empty } from 'antd';
import { useTranslation } from 'react-i18next';

import PluginDatabaseConnectionsClient from '..';
import { useCreateDatabaseConnectionAction, useTestConnectionAction } from '../hooks';
import { NAMESPACE } from '../locale';

export const CreateDatabaseConnectAction = () => {
  const [schema, setSchema] = useState({});
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const compile = useCompile();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [dialect, setDialect] = useState(null);
  const api = useAPIClient();
  const useDialectDataSource = (field) => {
    const options = [...plugin.types.keys()].map((key) => {
      const type = plugin.types.get(key);
      return {
        value: type.name,
        label: compile(type.label),
      };
    });
    field.dataSource = options;
  };
  return (
    <div>
      <ActionContext.Provider value={{ visible, setVisible }}>
        <Dropdown
          menu={{
            onClick(info) {
              if (info.key === '__empty__') {
                return;
              }
              const form = createForm({
                values: { type: info.key },
              });
              const type = plugin.types.get(info.key);
              setDialect(info.key);
              setVisible(true);
              setSchema({
                type: 'object',
                properties: {
                  [uid()]: {
                    type: 'void',
                    'x-component': 'Action.Drawer',
                    'x-decorator': 'FormV2',
                    'x-decorator-props': {
                      form,
                    },
                    title: compile("{{t('Add new')}}") + ' - ' + compile(type.label),
                    properties: {
                      body: {
                        type: 'void',
                        'x-component': type.DataSourceSettingsForm,
                      },
                      footer: {
                        type: 'void',
                        'x-component': 'Action.Drawer.Footer',
                        properties: {
                          testConnection: {
                            title: `{{ t("Test Connection",{ ns: "${NAMESPACE}" }) }}`,
                            'x-component': 'Action',
                            'x-use-component-props': 'useTestConnectionAction',
                          },
                          cancel: {
                            title: '{{t("Cancel")}}',
                            'x-component': 'Action',
                            'x-use-component-props': 'useCancelActionProps',
                          },
                          submit: {
                            title: '{{t("Submit")}}',
                            'x-component': 'Action',
                            'x-use-component-props': 'useCreateDatabaseConnectionAction',
                            'x-component-props': {
                              type: 'primary',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            },
            items: [
              plugin.types.size
                ? null
                : ({
                    key: '__empty__',
                    label: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<>{t('No external data source plugin installed', { ns: NAMESPACE })}</>}
                      />
                    ),
                  } as any),
            ]
              .filter(Boolean)
              .concat(
                [...plugin.types.keys()].map((key) => {
                  const type = plugin.types.get(key);
                  return {
                    key: key,
                    label: compile(type?.label),
                  };
                }),
              ),
          }}
        >
          <Button type={'primary'} icon={<PlusOutlined />}>
            {t('Add new')} <DownOutlined />
          </Button>
        </Dropdown>
        <SchemaComponent
          scope={{
            createOnly: false,
            useTestConnectionAction,
            dialect,
            useDialectDataSource,
            useCreateDatabaseConnectionAction,
            useCancelActionProps,
          }}
          schema={schema}
        />
      </ActionContext.Provider>
    </div>
  );
};
