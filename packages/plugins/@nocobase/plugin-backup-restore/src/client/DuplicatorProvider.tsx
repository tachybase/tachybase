import { SchemaComponentOptions, CurrentAppInfoProvider } from '@tachybase/client';
import React, { FC } from 'react';

export const DuplicatorProvider: FC = function (props) {
  return (
    <CurrentAppInfoProvider>
      <SchemaComponentOptions>{props.children}</SchemaComponentOptions>
    </CurrentAppInfoProvider>
  );
};

DuplicatorProvider.displayName = 'DuplicatorProvider';
