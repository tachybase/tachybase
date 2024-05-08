import { SortableItem, withDynamicSchemaProps } from '@tachybase/client';
import React from 'react';
import { useTabSearchFieldItemAction } from './TabSearchFieldItemAction';
import { Tabs } from 'antd-mobile';

export const TabSearchFieldMItem = withDynamicSchemaProps(
  (props) => {
    const { collectionField, Designer, items, onSelect } = useTabSearchFieldItemAction(props);

    if (!collectionField) {
      return null;
    }

    return (
      <SortableItem>
        <Designer />
        <Tabs style={{ '--title-font-size': '12px', color: '#a5a5a5' }} onChange={onSelect}>
          {items.map((value) => (
            <Tabs.Tab title={value.label} key={value.key} />
          ))}
        </Tabs>
      </SortableItem>
    );
  },
  { displayName: 'TabSearchFieldItem' },
);
