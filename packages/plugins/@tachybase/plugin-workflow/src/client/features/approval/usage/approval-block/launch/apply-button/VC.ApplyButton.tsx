import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  css,
  parseCollectionName,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  useAPIClient,
} from '@tachybase/client';

import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { useTranslation } from '../../../../locale';
import { FlowContextProvider } from '../../common/FlowContext.provider';
import { useActionResubmit } from '../hooks/useActionResubmit';
import { useSubmit } from './hooks/useSubmit';
import { useWithdrawAction } from './hooks/useWithdrawAction';
import { ActionBarProvider } from './Pd.ActionBar';
import { ApplyActionStatusProvider } from './Pd.ActionStatus';
import { WithdrawActionProvider } from './Pd.ActionWithdraw';

// 审批-发起: 发起按钮
export const ApplyButton = () => {
  const { t } = useTranslation();
  const context = useContext(SchemaComponentContext);
  const apiClient = useAPIClient();
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    apiClient
      .resource('workflows')
      .listApprovalFlows({ filter: { 'config.centralized': true } })
      .then(({ data }) => {
        setItems(data.data);
      })
      .catch(console.error);
  }, []);

  const onClick = useCallback(
    ({ key }) => {
      const targetItems = items.find((item) => +item.id === +key);
      const { applyForm } = targetItems?.config ?? {};
      const [dataSource, name] = parseCollectionName(targetItems.config.collection);

      setSchema({
        type: 'void',
        properties: {
          [`drawer-${targetItems.id}`]: {
            type: 'void',
            title: targetItems.title,
            'x-decorator': 'FlowContextProvider',
            'x-decorator-props': {
              workflow: targetItems,
            },
            'x-component': 'Action.Drawer',
            'x-component-props': {
              className: css`
                .ant-drawer-body {
                  background: var(--tb-box-bg);
                }
              `,
            },
            properties: {
              [applyForm]: {
                type: 'void',
                'x-decorator': 'CollectionProvider_deprecated',
                'x-decorator-props': {
                  name,
                  dataSource,
                },
                'x-component': 'RemoteSchemaComponent',
                'x-component-props': {
                  uid: applyForm,
                  noForm: true,
                },
              },
            },
          },
        },
      });
      setVisible(true);
    },
    [items],
  );
  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      <Dropdown
        menu={{
          items: items.map(({ id, title }) => ({
            key: id,
            label: title,
          })),
          onClick,
        }}
        disabled={!items.length}
      >
        <Button icon={<PlusOutlined />} type="primary">
          {t('Apply')}
          <DownOutlined />
        </Button>
      </Dropdown>
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        <SchemaComponent
          schema={schema}
          components={{
            RemoteSchemaComponent: RemoteSchemaComponent,
            CollectionProvider_deprecated: CollectionProvider_deprecated,
            FlowContextProvider: FlowContextProvider,
            ApplyActionStatusProvider: ApplyActionStatusProvider,
            ActionBarProvider,
            WithdrawActionProvider: WithdrawActionProvider,
          }}
          scope={{
            useSubmit: useSubmit,
            useWithdrawAction,
            useActionResubmit,
          }}
        />
      </SchemaComponentContext.Provider>
    </ActionContextProvider>
  );
};
