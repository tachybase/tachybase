import React from 'react';
import { SchemaComponentProvider, useSchemaComponentContext } from '@tachybase/client';

import { Button } from 'antd';

const Test = () => {
  const { designable, setDesignable } = useSchemaComponentContext();
  return (
    <Button
      style={{ marginBottom: 24 }}
      onClick={() => {
        setDesignable(!designable);
      }}
    >
      designable: {designable ? 'true' : 'false'}
    </Button>
  );
};

export default () => {
  return (
    <SchemaComponentProvider designable={true}>
      <Test />
    </SchemaComponentProvider>
  );
};
