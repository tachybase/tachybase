import React from 'react';
import { SchemaComponent, useRecord } from '@tachybase/client';

import { ActionLaunchContent } from './ActionLaunchContent.component';
import { RecordDecorator } from './Dt.Record';

// 审批-发起: 操作-查看
export const ViewActionLaunch = ({ popoverComponent = 'Action.Drawer', popoverComponentProps = {} }) => {
  const record = useRecord();
  return (
    <SchemaComponent
      components={{
        ViewActionContent: ActionLaunchContent,
        RecordDecorator,
      }}
      schema={{
        name: `view-${record.id}`,
        type: 'void',
        'x-component': 'Action.Link',
        title: '{{t("View")}}',
        properties: {
          drawer: {
            type: 'void',
            'x-component': popoverComponent,
            'x-component-props': {
              className: 'tb-action-popup',
              ...popoverComponentProps,
            },
            properties: {
              content: Object.assign(
                {
                  type: 'void',
                },
                record.approvalId
                  ? {}
                  : {
                      'x-decorator': 'RecordDecorator',
                    },
                {
                  'x-component': 'ViewActionContent',
                },
              ),
            },
          },
        },
      }}
    />
  );
};
