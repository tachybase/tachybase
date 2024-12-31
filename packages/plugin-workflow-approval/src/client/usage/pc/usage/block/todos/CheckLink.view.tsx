import React from 'react';
import { SchemaComponent, useRecord } from '@tachybase/client';

import { CheckContent } from './CheckContent.component';
import { getSchemaActionTodos } from './CheckLink.schema';

// 审批-待办: 操作-查看
export const ViewCheckLink = (props) => {
  const { popoverComponent = 'Action.Drawer', popoverComponentProps = {} } = props;
  const record = useRecord();

  const schema = getSchemaActionTodos({
    record,
    popoverComponent,
    popoverComponentProps,
  });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        CheckContent,
      }}
    />
  );
};
