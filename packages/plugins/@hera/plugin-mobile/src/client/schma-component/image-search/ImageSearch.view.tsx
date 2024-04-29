import { useDesigner, useSchemaInitializerRender } from '@nocobase/client';
import { RecursionField, useFieldSchema } from '@nocobase/schema';
import { Image, JumboTabs } from 'antd-mobile';
import React from 'react';
import { isTabSearchCollapsibleInputItem } from '../tab-search/utils';
import { images } from './data';

export const ImageSearchView = () => {
  const Designer = useDesigner();
  const fieldSchema = useFieldSchema();
  console.log('%c Line:11 🧀 fieldSchema', 'font-size:18px;color:#e41a6a;background:#b03734', fieldSchema);
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer'], fieldSchema['x-initializer-props']);

  return (
    <>
      {/* <Designer /> */}
      <RecursionField schema={fieldSchema} onlyRenderProperties />
      <React.Fragment>{render()}</React.Fragment>
    </>
  );
};

export default ImageSearchView;
