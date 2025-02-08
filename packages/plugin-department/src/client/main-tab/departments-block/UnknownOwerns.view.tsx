import React from 'react';
import { CardItem, ExtendCollectionsProvider, SchemaComponent, TableBlockProvider, Tabs } from '@tachybase/client';
import { observable, observer } from '@tachybase/schema';

import { lang } from '../../locale';
import { useOwnersFilterActionProps, useOwnersTableBlockProps } from './components/UnknowOwnersComponests';
import { ProviderRequest } from './Request.provider';
import { schemaUnknownOwerns as schema } from './UnknownOwerns.schema';

// TODO: 有待重新命名组件名称
export const ViewUnKnownOwerns = (props) => {
  const { record, field, handleSelect, useSelectOwners } = props;

  const ownersTableBlockProvider = observer((props) => {
    const requestProps = {
      collection: 'users',
      action: 'list',
      params: {
        filter: {
          'departments.id': record.id,
          ...(field.value.length > 0
            ? {
                id: {
                  $notIn: field.value.map((fieldValue) => fieldValue.id),
                },
              }
            : {}),
        },
      },
      rowKey: 'id',
    };

    return <TableBlockProvider {...props} {...requestProps} />;
  });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ownersTableBlockProvider,
      }}
      scope={{
        department: record,
        handleSelect,
        useSelectOwners,
        useOwnersFilterActionProps,
        useOwnersTableBlockProps,
      }}
    />
  );
};
