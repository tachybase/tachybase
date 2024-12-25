import React from 'react';
import { SchemaComponent, useCollectionRecordData } from '@tachybase/client';

import { usePropsCheckLink } from '../hooks/usePropsCheckLink';
import { usePropsShowDetail } from '../hooks/usePropsShowDetail';
import { ViewCheckContent } from './CheckContent.view';
import { getSchemaCheckLink } from './CheckLink.schema';

export const ViewCheckLink = () => {
  const record = useCollectionRecordData();
  const schema = getSchemaCheckLink({
    record,
  });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ViewCheckContent: ViewCheckContent,
      }}
      scope={{
        usePropsCheckLink: usePropsCheckLink,
        usePropsShowDetail: usePropsShowDetail,
      }}
    />
  );
};
