import { useDesigner, useSchemaInitializerRender } from '@nocobase/client';
import { RecursionField, useFieldSchema } from '@nocobase/schema';
import React from 'react';

export const ImageSearchView = () => {
  const Designer = useDesigner();
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer'], fieldSchema['x-initializer-props']);

  return (
    <>
      <Designer />
      <RecursionField schema={fieldSchema} onlyRenderProperties />
      <React.Fragment>{render()}</React.Fragment>
    </>
  );
};

export default ImageSearchView;
