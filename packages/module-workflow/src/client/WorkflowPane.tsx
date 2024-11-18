import React, { useContext } from 'react';
import { ExtendCollectionsProvider, SchemaComponent, SchemaComponentContext, usePlugin } from '@tachybase/client';
import { onFieldChange, useField, useFormEffects } from '@tachybase/schema';

import WorkflowPlugin, { RadioWithTooltip } from '.';
import { ExecutionStatusColumn, ExecutionStatusSelect } from './components/ExecutionStatus';
import OpenDrawer from './components/OpenDrawer';
import { ExecutionLink } from './ExecutionLink';
import { ExecutionResourceProvider } from './ExecutionResourceProvider';
import { collectionWorkflows, workflowSchema } from './schemas/workflows';
import { WorkflowLink } from './WorkflowLink';

function SyncOptionSelect(props) {
  const field = useField<any>();
  const workflowPlugin = usePlugin(WorkflowPlugin);

  useFormEffects(() => {
    onFieldChange('type', (f: any) => {
      let disabled = !f.value;
      if (f.value) {
        const trigger = workflowPlugin.triggers.get(f.value);
        if (trigger.sync != null) {
          disabled = true;
          field.setValue(trigger.sync);
        }
      }
      field.setPattern(disabled ? 'disabled' : 'editable');
    });
  });

  return <RadioWithTooltip {...props} />;
}

export function WorkflowPane(props) {
  const { schema = workflowSchema } = props;
  const ctx = useContext(SchemaComponentContext);

  const { getTriggersOptions } = usePlugin(WorkflowPlugin);
  return (
    <ExtendCollectionsProvider collections={[collectionWorkflows]}>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent
          schema={schema}
          components={{
            WorkflowLink,
            ExecutionResourceProvider,
            ExecutionLink,
            OpenDrawer,
            ExecutionStatusSelect,
            SyncOptionSelect,
            ExecutionStatusColumn,
          }}
          scope={{
            getTriggersOptions,
          }}
        />
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
}
