import React, { FC } from 'react';
import { CurrentAppInfoProvider, SchemaComponentOptions } from '@tachybase/client';

export const DuplicatorProvider: FC = function (props) {
  return (
    <CurrentAppInfoProvider>
      <SchemaComponentOptions>{props.children}</SchemaComponentOptions>
    </CurrentAppInfoProvider>
  );
};

DuplicatorProvider.displayName = 'DuplicatorProvider';
