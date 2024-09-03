import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { schemaMemberActions } from './MemberActions.schema';

export const ViewMemberActions = (props) => {
  const { department } = props;
  return department ? <SchemaComponent schema={schemaMemberActions} /> : null;
};
