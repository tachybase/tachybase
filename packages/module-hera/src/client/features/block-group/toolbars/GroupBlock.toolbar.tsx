import React from 'react';
import { SchemaToolbar, SchemaToolbarProps } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

export const GroupBlockToolbar = (
  props: React.JSX.IntrinsicAttributes & SchemaToolbarProps & { children?: React.ReactNode },
) => {
  const fieldSchema = useFieldSchema();
  return <SchemaToolbar title={fieldSchema.title} settings={fieldSchema['x-settings']} {...props} />;
};
