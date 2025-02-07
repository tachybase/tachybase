import { ExtendCollectionsProvider, SchemaComponentOptions } from '@tachybase/client';
import { WorkflowPane } from '@tachybase/module-workflow/client';
import { observer, useField } from '@tachybase/schema';

import { collectionCustomEventSources } from './collectionCustomEventSources';
import { schemaManagerPanne as schema } from './CustomEventSourcePane.schema';
import { useSyncCustomEventSource } from './useSyncCustomEventSource';

export const CustomEventSourcePane = () => {
  return (
    <ExtendCollectionsProvider collections={[collectionCustomEventSources]}>
      <SchemaComponentOptions
        components={{
          ColumnWorkflow,
          ColumnUISchema,
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

const ColumnUISchema = observer(
  () => {
    const field = useField<any>();
    return field?.value?.title || `${field?.value?.['x-uid']}`;
  },
  { displayName: 'ColumnUISchema' },
);
