import React from 'react';
import { SchemaComponent, useRecord } from '@tachybase/client';
import { ViewActionTodosContent } from './VC.ViewActionTodosContent';

// 审批-待办: 操作-查看
export const ViewActionTodos = ({ popoverComponent = 'Action.Drawer', popoverComponentProps = {} }) => {
  const record = useRecord();
  return (
    <SchemaComponent
      components={{
        ViewActionTodosContent,
      }}
      schema={{
        name: `assignee-view-${record.id}`,
        type: 'void',
        'x-component': 'Action.Link',
        title: '{{t("View")}}',
        properties: {
          drawer: {
            type: 'void',
            'x-component': popoverComponent,
            'x-component-props': {
              className: 'nb-action-popup',
              ...popoverComponentProps,
            },
            properties: {
              content: {
                type: 'void',
                'x-component': 'ViewActionTodosContent',
              },
            },
          },
        },
      }}
    />
  );
};
