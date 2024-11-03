import React, { createContext, useEffect } from 'react';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { useField, useFieldSchema } from '@tachybase/schema';

export const ManualActionStatusContext = createContext<number | null>(null);
ManualActionStatusContext.displayName = 'ManualActionStatusContext';

export function ManualActionStatusProvider({ value, children }) {
  const { userJob, execution } = useFlowContext();
  const button = useField();
  const buttonSchema = useFieldSchema();

  useEffect(() => {
    if (execution.status || userJob.status) {
      button.disabled = true;
      button.visible = userJob.status === value && userJob.result._ === buttonSchema.name;
    }
  }, [execution, userJob, value, button, buttonSchema.name]);

  return <ManualActionStatusContext.Provider value={value}>{children}</ManualActionStatusContext.Provider>;
}
