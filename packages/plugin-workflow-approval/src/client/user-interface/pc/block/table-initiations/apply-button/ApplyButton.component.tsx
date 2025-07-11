import React, { useCallback, useContext, useEffect, useState } from 'react';
import { css, parseCollectionName, SchemaComponentContext, useAPIClient } from '@tachybase/client';

import { ProviderApplyButton } from './ApplyButton.provider';
import { ViewApplyButton } from './ApplyButton.view';

export const ApplyButton = () => {
  const context = useContext(SchemaComponentContext);
  const apiClient = useAPIClient();
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [schema, setSchema] = useState(null);

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
    [items],
  );

  useEffect(() => {
    apiClient
      .resource('workflows')
      .listApprovalFlows({ filter: { 'config.centralized': true } })
      .then(({ data }) => {
        setItems(data.data);
      })
      .catch(console.error);
  }, []);

  return (
    <ProviderApplyButton {...{ visible, setVisible, items, context, onClick }}>
      <ViewApplyButton schema={schema} />
    </ProviderApplyButton>
  );
};
