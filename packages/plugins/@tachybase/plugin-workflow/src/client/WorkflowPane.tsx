import React, { useContext, useEffect } from 'react';
import { SchemaComponent, SchemaComponentContext, usePlugin, useRecord } from '@tachybase/client';
import { onFieldChange, useField, useFormEffects } from '@tachybase/schema';

import { Card } from 'antd';

import WorkflowPlugin, { RadioWithTooltip } from '.';
import { ExecutionStatusColumn, ExecutionStatusSelect } from './components/ExecutionStatus';
import OpenDrawer from './components/OpenDrawer';
import { ExecutionLink } from './ExecutionLink';
import { ExecutionResourceProvider } from './ExecutionResourceProvider';
import { workflowSchema } from './schemas/workflows';
import { WorkflowLink } from './WorkflowLink';

function SyncOptionSelect(props) {
  const field = useField<any>();
  const record = useRecord();
  const workflowPlugin = usePlugin(WorkflowPlugin);

  useFormEffects((form) => {
    onFieldChange('type', (f: any) => {
      let disabled = !f.value;
      if (f.value) {
        const trigger = workflowPlugin.triggers.get(f.value);
        if (trigger.sync != null) {
          disabled = true;
          field.setValue(trigger.sync);
        } else {
          field.setInitialValue(false);
        }
      }
      field.setPattern(disabled ? 'disabled' : 'editable');
    });
  });

  useEffect(() => {
    if (record.id) {
      const trigger = workflowPlugin.triggers.get(record.type);
      if (trigger.sync != null) {
        field.setValue(trigger.sync);
      } else {
        field.setInitialValue(false);
      }
    }
  }, [record.id, record.type, field, workflowPlugin.triggers]);

  return <RadioWithTooltip {...props} />;
}

export function WorkflowPane() {
  const ctx = useContext(SchemaComponentContext);
  const { getTriggersOptions } = usePlugin(WorkflowPlugin);
  return (
    <Card bordered={false}>
      <SchemaComponentContext.Provider value={{ ...ctx, designable: false }}>
        <SchemaComponent
          schema={workflowSchema}
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
    </Card>
  );
}
