import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { schemaNotificationProviders as schema } from './NotificationProviders.schema';
import { ProviderOptions } from './ProviderOptions';

export const NotificationProviders = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        ProviderOptions,
      }}
    />
  );
};
