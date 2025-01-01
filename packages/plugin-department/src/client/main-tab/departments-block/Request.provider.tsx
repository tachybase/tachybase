import React from 'react';
import { ResourceActionProvider } from '@tachybase/client';

export const ProviderRequest = (props) => {
  const { field, record, children } = props;
  return (
    // @ts-ignore
    <ResourceActionProvider
      collection={'users'}
      request={{
        resource: `departments/${record.id}/members`,
        action: 'list',
        params: {
          filter: field.value.length
            ? {
                id: {
                  $notIn: field.value.map((fieldValue) => fieldValue.id),
                },
              }
            : {},
        },
      }}
    >
      {children}
    </ResourceActionProvider>
  );
};
