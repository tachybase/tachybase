import { Plugin, SchemaInitializerItem, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';
import React, { useCallback } from 'react';
import { COLLECTION_NOTICE_NAME } from '../../common/constants';
import { NoticeBlockProvider } from './NoticeBlock.provider';
import { NoticeCenter } from './NoticeCenter.schema';

export class SCApprovalBlock extends Plugin {
  async load() {
    this.app.addComponents({
      NoticeBlockProvider: NoticeBlockProvider,
      NoticeCenter: NoticeCenter,
    });
  }
}

function createSchema() {
  const id = uid();
  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-decorator-props': {
      collection: COLLECTION_NOTICE_NAME,
      params: {
        appends: [
          'user.id',
          'user.nickname',
          'node.id',
          'node.title',
          'job.id',
          'job.status',
          'job.result',
          'workflow.id',
          'workflow.title',
          'workflow.enabled',
          'execution.id',
          'execution.status',
        ],
      },
      action: 'listCentralized',
    },
    'x-decorator': 'NoticeBlockProvider',
    'x-component': 'CardItem',
    'x-designer': 'TableBlockDesigner',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:table',
    properties: {
      notice: {
        type: 'void',
        'x-component': 'NoticeCenter',
      },
    },
  };
}

export const NoticeBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  const handleClick = useCallback(() => {
    const schema = createSchema();
    insert(schema);
  }, [insert, createSchema]);

  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} />;
};
