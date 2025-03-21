import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

const schema = {
  type: 'object',
};

export const Settings = () => {
  return (
    <Card bordered={false}>
      <SchemaComponent schema={schema} />
    </Card>
  );
};
