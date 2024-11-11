import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { schemaUnknownOwerns as schema } from './UnknownOwerns.schema';
import { ProviderRequest } from './Request.provider';

// TODO: 有待重新命名组件名称
export const ViewUnKnownOwerns = (props) => {
  const { record, field, handleSelect, useSelectOwners } = props;

  const RequestProvider = ({ children }) => (
    <ProviderRequest field={field} record={record}>
      {children}
    </ProviderRequest>
  );

  return (
    <SchemaComponent
      schema={schema}
      components={{
        RequestProvider,
      }}
      scope={{
        department: record,
        handleSelect,
        useSelectOwners,
      }}
    />
  );
};
