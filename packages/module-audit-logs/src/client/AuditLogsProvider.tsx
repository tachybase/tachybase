import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { AuditLogsBlockInitializer } from './AuditLogsBlockInitializer';
import { AuditLogsBlockProvider } from './AuditLogsBlockProvider';
import { AuditLogsField } from './components/AuditLogsField';
import { AuditLogsValue } from './components/AuditLogsValue';
import { AuditLogsViewActionInitializer } from './components/AuditLogsViewActionInitializer';
import { AuditLogs } from './deplicated/AuditLogs';
import { AuditLogsTableActionColumnInitializer } from './initializers/AuditLogsTableActionColumnInitializer';

export const AuditLogsProvider = (props: any) => {
  return (
    <SchemaComponentOptions
      components={{
        AuditLogs,
        AuditLogsBlockProvider,
        AuditLogsBlockInitializer,
        AuditLogsValue,
        AuditLogsField,
        AuditLogsViewActionInitializer,
        AuditLogsTableActionColumnInitializer,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};
