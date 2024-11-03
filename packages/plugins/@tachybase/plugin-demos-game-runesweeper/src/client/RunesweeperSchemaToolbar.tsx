import React from 'react';
import { SchemaToolbar, SchemaToolbarProps } from '@tachybase/client';

export const RunesweeperSchemaToolbar = (
  props: React.JSX.IntrinsicAttributes & SchemaToolbarProps & { children?: React.ReactNode },
) => {
  return <SchemaToolbar title="Runesweeper" {...props} />;
};
