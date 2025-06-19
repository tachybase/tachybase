import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { ApiLogsBlockInitializer } from './ApiLogsBlockInitializer';
import { ApiLogsBlockProvider } from './ApiLogsBlockProvider';
import { ApiLogsField } from './components/ApiLogsField';
import { ApiLogsValue } from './components/ApiLogsValue';
import { ApiLogsViewActionInitializer } from './components/ApiLogsViewActionInitializer';
import { ApiLogs } from './deplicated/ApiLogs';
import { ApiLogsTableActionColumnInitializer } from './initializers/ApiLogsTableActionColumnInitializer';

export const ApiLogsProvider = (props: any) => {
  return (
    <SchemaComponentOptions
      components={{
        ApiLogs,
        ApiLogsBlockProvider,
        ApiLogsBlockInitializer,
        ApiLogsValue,
        ApiLogsField,
        ApiLogsViewActionInitializer,
        ApiLogsTableActionColumnInitializer,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};
