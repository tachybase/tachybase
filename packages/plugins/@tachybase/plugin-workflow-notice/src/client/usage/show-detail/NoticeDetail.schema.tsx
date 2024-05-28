import React from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
} from '@tachybase/client';
import { DetailsBlockProvider } from '@tachybase/plugin-workflow/client';

import { tval } from '../../locale';
import { useContextMyComponent } from './contexts/MyComponent.context';
import { usePropsNoticeDetail } from './hooks/usePropsNoticeDetail';
import { NoticeDetailProvider } from './NoticeDetail.provider';

// 审批-待办-查看: 内容

export const NoticeDetailContent = () => {
  return (
    <NoticeDetailProvider>
      <NoticeDetail />
    </NoticeDetailProvider>
  );
};

const NoticeDetail = (props) => {
  const { id, schemaId } = useContextMyComponent();

  return (
    <SchemaComponent
      components={{
        NoticeDetailProvider,
        RemoteSchemaComponent,
        // SchemaComponentContextProvider,
        // FormBlockProvider,
        // ActionBarProvider,
        // ApprovalActionProvider,
        // ApprovalFormBlockProvider: ApprovalFormBlockDecorator,
        SchemaComponentProvider,
        DetailsBlockProvider,
      }}
      scope={{
        // XXX: 这里的这个scope 需要想一个更有利于可读性的注册地方
        usePropsNoticeDetail,
        // useApprovalDetailBlockProps,
        // useApprovalFormBlockProps,
        useDetailsBlockProps: useFormBlockContext,
        // useSubmit,
      }}
      schema={{
        name: `content-${id}`,
        type: 'void',
        'x-component': 'Tabs',
        properties: {
          detail: {
            type: 'void',
            title: tval('Content Detail'),
            'x-component': 'Tabs.TabPane',
            properties: {
              detail: {
                type: 'void',
                'x-decorator': 'NoticeDetailProvider',
                'x-decorator-props': {
                  designable: false,
                },
                'x-component': 'RemoteSchemaComponent',
                'x-component-props': {
                  uid: schemaId,
                  noForm: true,
                },
              },
            },
          },
        },
      }}
    />
  );
};
