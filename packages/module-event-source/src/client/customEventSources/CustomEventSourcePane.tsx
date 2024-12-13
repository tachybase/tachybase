import React from 'react';
import { ExtendCollectionsProvider, SchemaComponentOptions } from '@tachybase/client';
import { WorkflowPane } from '@tachybase/module-workflow/client';
import { observer, useField } from '@tachybase/schema';

import { collectionWorkflowsManager } from './customEventSourcePane.collection';
import { schemaManagerPanne as schema } from './CustomEventSourcePane.schema';
import { useSyncCustomEventSource } from './useSyncCustomEventSource';

export const CustomEventSourcePane = () => {
  return (
    <ExtendCollectionsProvider collections={[collectionWorkflowsManager]}>
      <SchemaComponentOptions
        components={{
          ColumnWorkflow,
          ColumnUiSchema,
        }}
        scope={{
          useSyncCustomEventSource: useSyncCustomEventSource,
        }}
      >
        <WorkflowPane schema={schema} />
      </SchemaComponentOptions>
    </ExtendCollectionsProvider>
  );
};

const ColumnWorkflow = observer(
  () => {
    const field = useField<any>();
    return `${field?.value?.title}-${field?.value?.id}`;
  },
  { displayName: 'ColumnWorkflow' },
);

const ColumnUiSchema = observer(
  () => {
    const field = useField<any>();
    return field?.value?.title || `${field?.value?.['x-uid']}`;
  },
  { displayName: 'ColumnUiSchema' },
);
