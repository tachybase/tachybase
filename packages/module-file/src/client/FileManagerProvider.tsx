import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import * as hooks from './hooks';
import { UploadActionInitializer } from './initializers';

export const FileManagerProvider = ({ children }) => {
  return (
    <SchemaComponentOptions scope={hooks} components={{ UploadActionInitializer }}>
      {children}
    </SchemaComponentOptions>
  );
};
