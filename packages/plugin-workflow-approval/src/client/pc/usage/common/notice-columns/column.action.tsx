import React from 'react';
import { SchemaComponent, useCollectionRecordData } from '@tachybase/client';

import { NoticeDetailContent } from '../notice-show-detail/NoticeDetail.schema';

const createSchema = ({ record }) => {
  const { id } = record;
  return {
    name: `notice-view-${id}`,
    type: 'void',
    'x-component': 'Action.Link',
    title: '{{t("View")}}',
    properties: {
      drawer: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          className: 'tb-action-popup',
        },
        properties: {
          content: {
            type: 'void',
            'x-component': 'NoticeDetailContent',
          },
        },
      },
    },
  };
};

export const ColumnAction = () => {
  const record = useCollectionRecordData();
  const schema = createSchema({ record });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        NoticeDetailContent: NoticeDetailContent,
      }}
    />
  );
};
