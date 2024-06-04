import React from 'react';
import { CurrentAppInfoProvider, SchemaComponentOptions } from '@tachybase/client';

export const DuplicatorProvider = function (props) {
  return <SchemaComponentOptions>{props.children}</SchemaComponentOptions>;
};

DuplicatorProvider.displayName = 'DuplicatorProvider';
