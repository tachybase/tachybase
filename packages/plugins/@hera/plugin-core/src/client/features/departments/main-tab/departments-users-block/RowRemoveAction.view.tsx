import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { useTranslation } from '../../../../locale';
import { schemaRowRemoveAction as schema } from './RowRemoveAction.schema';
import { useRemoveMemberAction } from './scopes/useRemoveMemberAction';

export const ViewRowRemoveAction = (props) => {
  const { t } = useTranslation();
  const { department } = props;
  return department ? (
    <SchemaComponent
      schema={schema}
      scope={{
        t,
        useRemoveMemberAction,
      }}
    />
  ) : null;
};
