import { useCallback, useContext, useEffect, useState } from 'react';
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
import { ProviderContextWorkflow } from '@tachybase/module-workflow/client';
import { useFieldSchema } from '@tachybase/schema';

import { Button, Col, Row } from 'antd';

import { useActionReminder } from '../common/hooks/useActionReminder';
import { useActionResubmit } from '../common/hooks/useActionResubmit';
import { useSubmitCreate } from '../common/hooks/useSubmitCreate';
import { useWithdrawAction } from '../common/hooks/useWithdrawAction';
import { ActionBarProvider } from '../common/providers/ActionBar.provider';
import { ProviderActionReminder } from '../common/providers/ActionReminder.provider';
import { ApplyActionStatusProvider } from '../common/providers/ActionStatus.provider';
import { WithdrawActionProvider } from '../common/providers/WithdrawAction.provider';

/**
 * DOC:
 * 区块初始化组件: 审批: 发起申请 (旧版)
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
            'x-decorator': 'ProviderContextWorkflow',
            'x-decorator-props': {
              value: {
                workflow: targetItems,
              },
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
            ProviderContextWorkflow,
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
