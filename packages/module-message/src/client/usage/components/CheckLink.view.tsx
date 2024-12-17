import React from 'react';
import { SchemaComponent, useCollectionRecordData } from '@tachybase/client';

import { usePropsCheckLink } from '../hooks/usePropsCheckLink';
import { usePropsShowDetail } from '../hooks/usePropsShowDetail';
import { CheckContent } from './CheckContent.component';
import { getSchemaCheckLink } from './CheckLink.schema';

export const ViewCheckLink = (props) => {
  const { popoverComponent = 'Action.Drawer', popoverComponentProps = {} } = props;
  const record = useCollectionRecordData();
  const schema = getSchemaCheckLink({
    record,
    popoverComponent,
    popoverComponentProps,
  });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        CheckContent: CheckContent,
      }}
      scope={{
        usePropsCheckLink: usePropsCheckLink,
        usePropsShowDetail: usePropsShowDetail,
      }}
    />
  );
};
