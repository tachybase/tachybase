import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { ExportActionInitializer, ExportDesigner, useExportAction } from './';

export const ExportPluginProvider = (props: any) => {
  return (
    <SchemaComponentOptions components={{ ExportActionInitializer, ExportDesigner }} scope={{ useExportAction }}>
      {props.children}
    </SchemaComponentOptions>
  );
};
