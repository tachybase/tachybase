import React, { FC } from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { RuleConfigForm } from './sequence';

export const SequenceFieldProvider = (props) => {
  return (
    <SchemaComponentOptions
      components={{
        RuleConfigForm,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};
