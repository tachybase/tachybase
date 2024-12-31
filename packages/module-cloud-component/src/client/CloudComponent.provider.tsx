import React from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions } from '@tachybase/client';

import { CloudComponentLink } from './components/CloudComponentLink';

export const ProviderCloudComponent = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        cloudComponent: {
          order: 105,
          component: 'CloudComponentLink',
          pin: true,
          snippet: 'pm',
          belongTo: 'pinnedmenu',
        },
      }}
    >
      <SchemaComponentOptions
        components={{
          CloudComponentLink,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
