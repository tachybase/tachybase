import { SortableItem, withDynamicSchemaProps } from '@nocobase/client';
import { Tabs } from 'antd-mobile';
import React from 'react';
import { useActionImageSearchItemView } from '../hooks/useAction.ImageSearchItemView';

export const ImageSearchItemView = withDynamicSchemaProps(
  (props) => {
    const { collectionField, Designer, items, onSelect } = useActionImageSearchItemView(props);

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
