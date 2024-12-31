import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { schemaMemberActions } from './MemberActions.schema';
import { useRefreshActionProps } from './scopes/useRefreshActionProps';

export const ViewMemberActions = (props) => {
  const { department } = props;
  return department ? (
    <SchemaComponent
      scope={{
        useRefreshActionProps,
      }}
      schema={schemaMemberActions}
    />
  ) : null;
};
