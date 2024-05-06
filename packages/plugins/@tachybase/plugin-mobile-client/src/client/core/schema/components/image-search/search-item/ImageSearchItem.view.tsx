import { SortableItem, css, withDynamicSchemaProps } from '@nocobase/client';
import { Image, JumboTabs } from 'antd-mobile';
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
            <JumboTabs.Tab key={key} title={''} description={<ImageDescription srcUrl={imageUrl} label={label} />} />
          ))}
        </JumboTabs>
      </SortableItem>
    );
  },
  { displayName: 'ImageSearchItemView' },
);

const ImageDescription = (props) => {
  const { srcUrl, label } = props;
  return (
    <div
      className={css`
        display: 'flex';
        flex-direction: 'column';
        width: '100%';
        height: '100%';
        :active {
          background-color: transparent;
        }
      `}
    >
      <Image src={srcUrl} width={100} height={100} fit="fill" />
      <p
        className={css`
          font-weight: 400;
          font-size: 17.6px;
          line-height: 1;
        `}
      >
        {label}
      </p>
    </div>
  );
};
