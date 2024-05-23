import React from 'react';
import { BlockInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { tval } from '../../locale';

export const BulkWorkflowActionInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const schema = {
    type: 'void',
    title: tval('Bulk workflow'),
    'x-component': 'Action',
    'x-use-component-props': 'useCustomizeBulkWorkflowActionProps',
    'x-align': 'right',
    'x-acl-action': 'update',
    'x-decorator': 'ACLActionProvider',
    'x-acl-action-props': {
      skipScopeCheck: true,
    },
    'x-action': 'customize:bulkWorkflow',
    'x-toolbar': 'ActionSchemaToolbar',
    'x-settings': 'actionSettings:bulkWorkflow',
    'x-action-settings': {
      bindWorkflow: false,
      updateMode: 'selected',
    },
    'x-component-props': {
      icon: 'CarryOutOutlined',
    },
  };
  return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />;
};
