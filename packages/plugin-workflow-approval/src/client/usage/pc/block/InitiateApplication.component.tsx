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

import { FlowContextProvider } from './common/FlowContext.provider';
import { ActionBarProvider } from './initiations/apply-button/ActionBar.provider';
import { ApplyActionStatusProvider } from './initiations/apply-button/ActionStatus.provider';
import { useSubmitCreate } from './initiations/apply-button/hooks/useSubmitCreate';
import { useActionReminder } from './initiations/hooks/useActionReminder';
import { useActionResubmit } from './initiations/hooks/useActionResubmit';
import { useWithdrawAction } from './initiations/hooks/useWithdrawAction';
import { ProviderActionReminder } from './initiations/providers/ActionReminder.provider';
import { WithdrawActionProvider } from './initiations/WithdrawAction.provider';

/**
 * DOC:
 * 区块初始化组件: 审批: 发起申请
 */
export const InitiateApplication = () => {
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
      params: {
        pagination: false,
        sort: 'createdAt',
        filter: {
          $and: [
            // NOTE: 将审批类型的且处于启用状态的筛选出来
            {
              type: {
                $eq: 'approval',
              },
            },
            {
              enabled: {
                $eq: true,
              },
            },
            {
              ...decorator?.params?.filter,
            },
          ],
        },
      },
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
  }, [decorator?.params?.filter]);

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
                    {item.title}
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
            ProviderActionReminder,
          }}
          scope={{
            useSubmit: useSubmitCreate,
            useWithdrawAction,
            useActionResubmit,
            useActionReminder,
          }}
        />
      </SchemaComponentContext.Provider>
    </ActionContextProvider>
  );
};
