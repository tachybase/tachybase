import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { ProviderRequest } from './Request.provider';
import { schemaUnknownOwerns as schema } from './UnknownOwerns.schema';

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
