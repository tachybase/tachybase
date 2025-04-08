import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { Card } from 'antd';

import { useCreateProviderAction } from './hooks';
import ProviderOptions from './ProviderOptions';
import { collectionOcrProviders, schemaOcrProviders } from './schemas/providers';

export function OcrProviders() {
  return (
    <ExtendCollectionsProvider collections={[collectionOcrProviders]}>
      <SchemaComponent
        schema={schemaOcrProviders}
        scope={{
          useCreateProviderAction,
        }}
        components={{
          ProviderOptions,
        }}
      />
    </ExtendCollectionsProvider>
  );
}
