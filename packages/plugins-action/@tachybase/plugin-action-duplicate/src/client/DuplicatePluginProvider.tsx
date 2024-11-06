import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { DuplicateAction } from './DuplicateAction';
import { DuplicateActionInitializer } from './DuplicateActionInitializer';

export const DuplicatePluginProvider = (props: any) => {
  return (
    <SchemaComponentOptions components={{ DuplicateActionInitializer, DuplicateAction }}>
      {props.children}
    </SchemaComponentOptions>
  );
};
