import React, { FC } from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import * as hooks from './hooks';
import { UploadActionInitializer } from './initializers';

export const FileManagerProvider: FC = (props) => {
  return (
    <SchemaComponentOptions scope={hooks} components={{ UploadActionInitializer }}>
      {props.children}
    </SchemaComponentOptions>
  );
};
