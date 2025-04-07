import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import { useCreateProviderAction } from './hooks';
import ProviderOptions from './ProviderOptions';
import providers from './schemas/providers';

export function OcrProviders() {
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={providers}
        components={{
          ProviderOptions,
        }}
        scope={{
          useCreateProviderAction,
        }}
      />
    </Card>
  );
}
