import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActionContextProvider,
  CollectionProvider_deprecated,
  css,
  parseCollectionName,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  useRequest,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { Button, Col, Row } from 'antd';

import { FlowContextProvider } from '../common/FlowContext.provider';
import { useCreateSubmit } from './apply-button/hooks/useSubmit';
import { ActionBarProvider } from './apply-button/Pd.ActionBar';
import { ApplyActionStatusProvider } from './apply-button/Pd.ActionStatus';
import { useActionResubmit } from './hooks/useActionResubmit';
import { useWithdrawAction } from './hooks/useWithdrawAction';
import { WithdrawActionProvider } from './Pd.WithdrawAction';

// 审批-发起: 申请区块
export const ApprovalBlockLaunchApplication = (props) => {
  const fieldSchema = useFieldSchema();
  const decorator = fieldSchema?.parent?.['x-decorator-props'];
  const [options, setOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [schema, setSchema] = useState(null);
  const context = useContext(SchemaComponentContext);
  const { run } = useRequest(
    {
      resource: decorator?.collection,
      action: decorator?.action,
      params: { pageSize: 99999, filter: { ...decorator?.params?.filter } },
    },
    {
      manual: true,
      onSuccess(res) {
        const result = {
          items: [],
          data: [],
        };
        res.data?.forEach((item, index) => {
          if ((index + 1) % 4 === 0) {
            result.items.push(item);
            result.data.push(result.items);
            result.items = [];
          } else {
            result.items.push(item);
          }
          if (index + 1 === res.data.length) {
            result.data.push(result.items);
          }
        });
        setOptions(result.data);
      },
    },
  );

  useEffect(() => {
    run();
  }, []);

  const onClick = useCallback(
    (targetItems) => {
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
    [options],
  );

  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      {options?.map((data, index) => {
        return (
          <Row key={index}>
            {data?.map((item, index) => {
              return (
                <Col span={6} key={index}>
                  <Button
                    style={{
                      width: '100%',
                      height: '100%',
                      border: '1px solid #f3f3f3',
                      textAlign: 'center',
                      padding: '20px 10px',
                    }}
                    onClick={() => {
                      onClick(item);
                    }}
                  >
                    {item.title.replace('审批流:', '')}
                  </Button>
                </Col>
              );
            })}
          </Row>
        );
      })}
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        <SchemaComponent
          schema={schema}
          components={{
            RemoteSchemaComponent,
            CollectionProvider_deprecated,
            FlowContextProvider,
            ApplyActionStatusProvider,
            ActionBarProvider,
            ProviderActionResubmit: () => null,
            WithdrawActionProvider,
          }}
          scope={{
            useSubmit: useCreateSubmit,
            useWithdrawAction,
            useActionResubmit,
          }}
        />
      </SchemaComponentContext.Provider>
    </ActionContextProvider>
  );
};
