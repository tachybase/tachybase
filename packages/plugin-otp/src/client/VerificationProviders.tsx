import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import ProviderOptions from './ProviderOptions';
import providers from './schemas/providers';

export function VerificationProviders() {
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={providers}
        components={{
          ProviderOptions,
        }}
      />
    </Card>
  );
}
