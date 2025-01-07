import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import collection, { COLLECTION_NAME_MESSAGES_PROVIDERS } from '../../../common/collections/messages_providers';
import { schemaNotificationProviders as schema } from './NotificationProviders.schema';
import { ProviderOptions } from './ProviderOptions';

export const NotificationProviders = () => {
  return (
    <ExtendCollectionsProvider collections={[collection]}>
      <SchemaComponent
        schema={schema}
        components={{
          ProviderOptions,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
