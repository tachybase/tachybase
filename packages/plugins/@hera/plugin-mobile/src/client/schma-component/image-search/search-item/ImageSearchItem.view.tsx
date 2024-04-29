import { SortableItem, withDynamicSchemaProps } from '@nocobase/client';
import { Image, JumboTabs, Tabs } from 'antd-mobile';
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
        <JumboTabs onChange={onSelect}>
          {items.map(({ key, label, imageUrl }) => (
            <>
              <JumboTabs.Tab key={key} title={label} description={<ImageDescription srcUrl={imageUrl} />} />
              <p>{label}</p>
            </>
          ))}
        </JumboTabs>
      </SortableItem>
    );
  },
  { displayName: 'ImageSearchItemView' },
);

const ImageDescription = (props) => {
  const { srcUrl } = props;
  return <Image src={srcUrl} width={100} height={100} fit="fill" />;
};
