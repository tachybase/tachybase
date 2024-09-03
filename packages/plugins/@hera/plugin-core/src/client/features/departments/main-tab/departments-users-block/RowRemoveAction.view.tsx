import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { schemaRowRemoveAction as schema } from './RowRemoveAction.schema';
import { useRemoveMemberAction } from './scopes/useRemoveMemberAction';

export const ViewRowRemoveAction = (props) => {
  const { department } = props;

  return department ? (
    <SchemaComponent
      schema={schema}
      scope={{
        useRemoveMemberAction: useRemoveMemberAction,
      }}
    />
  ) : null;
};
