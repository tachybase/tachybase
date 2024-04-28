import { useDesigner, useSchemaInitializerRender } from '@nocobase/client';
import { useFieldSchema } from '@nocobase/schema';
import { Image, JumboTabs } from 'antd-mobile';
import React from 'react';
import { isTabSearchCollapsibleInputItem } from '../tab-search/utils';
import { images } from './data';

export const ImageSearchView = () => {
  const Designer = useDesigner();
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer'], fieldSchema['x-initializer-props']);

  const filterProperties = (s) => {
    if (!isTabSearchCollapsibleInputItem(s['x-component'])) {
      return true;
    } else {
      // 保留第一个，如果进入这个判断一定有值，所以取0不会出错
      return (
        s === Object.values(s.parent.properties).filter((s) => isTabSearchCollapsibleInputItem(s['x-component']))[0]
      );
    }
  };

  return (
    <>
      <Designer />
      {/* <JumboTabs>
        {images.map(({ label, imageUrl }) => (
          <JumboTabs.Tab key={label} title={label} description={<ImageDescription srcUrl={imageUrl} />} />
        ))}
      </JumboTabs> */}
      <React.Fragment>{render()}</React.Fragment>
    </>
  );
};

const ImageDescription = (props) => {
  const { srcUrl } = props;
  return <Image src={srcUrl} width={100} height={100} fit="fill" />;
};

export default ImageSearchView;
