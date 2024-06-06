import React from 'react';
import { BlockInitializer, useSchemaInitializerItem } from '@tachybase/client';

import { tval } from '../../../locale';

export const APIRegularInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  return <BlockInitializer {...itemConfig} schema={schema} item={itemConfig} />;
};

const schema = {
  type: 'void',
  title: tval('Regular workflow'),
  'x-component': 'Action',
  'x-use-component-props': 'usePropsAPIRegular',
  'x-align': 'right',
  'x-acl-action': 'update',
  'x-decorator': 'ACLActionProvider',
  'x-acl-action-props': {
    skipScopeCheck: true,
  },
  'x-toolbar': 'ActionSchemaToolbar',
  'x-settings': 'actionSettings:APIRegular',
  'x-action': 'customize:APIRegular',
  'x-action-settings': {
    bindWorkflow: false,
    updateMode: 'selected',
  },
  'x-component-props': {
    icon: 'CarryOutOutlined',
  },
};
