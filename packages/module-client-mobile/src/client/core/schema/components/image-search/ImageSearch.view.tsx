import React from 'react';
import { useDesigner, useSchemaInitializerRender } from '@tachybase/client';
import { RecursionField, useFieldSchema } from '@tachybase/schema';

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
