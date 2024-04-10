import { SortableItem, withDynamicSchemaProps } from '@nocobase/client';
import { ConfigProvider, Menu } from 'antd';
import React from 'react';
import { useTabSearchFieldItemAction } from './TabSearchFieldItemAction';

export const TabSearchFieldItem = withDynamicSchemaProps(
  (props) => {
    const { collectionField, Designer, items, onSelect } = useTabSearchFieldItemAction(props);

    if (!collectionField) {
      return null;
    }

    return (
      <SortableItem>
        <Designer />
        <ConfigProvider
          theme={{
            components: {
              Menu: { itemColor: '#a5a5a5', itemHoverColor: '#1d2ffff18' },
            },
          }}
        >
          <Menu items={items} mode="horizontal" onSelect={onSelect} defaultSelectedKeys={['all']} />
        </ConfigProvider>
      </SortableItem>
    );
  },
  { displayName: 'TabSearchFieldItem' },
);
