import { SortableItem, withDynamicSchemaProps } from '@nocobase/client';
import { Tabs } from 'antd-mobile';
import React from 'react';
import { useAction_ImageSearchItemView } from './ImageSearchItem.viewaction';

export const ImageSearchItemView = withDynamicSchemaProps(
  (props) => {
    console.log('%c Line:8 🥐 props', 'font-size:18px;color:#ea7e5c;background:#ffdd4d', props);
    const { collectionField, Designer, items, onSelect } = useAction_ImageSearchItemView(props);

    if (!collectionField) {
      return null;
    }

    return (
      <SortableItem>
        <Designer />
        <Tabs
          style={{
            '--title-font-size': '12px',
            color: '#a5a5a5',
          }}
          onChange={onSelect}
        >
          {items.map(({ label, key }) => (
            <Tabs.Tab key={key} title={label} />
          ))}
        </Tabs>
      </SortableItem>
    );
  },
  { displayName: 'ImageSearchItemView' },
);
