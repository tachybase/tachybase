import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { getSchemaApplicationNew } from './InitiateApplicatonNew.schema';

/**
 * DOC:
 * 区块初始化组件: 审批-发起申请
 */
export const ViewInitiateApplicationNew = (props) => {
  const { collection, action, params } = props;
  const schema = getSchemaApplicationNew({ collection, action, params });
  return <SchemaComponent schema={schema} />;
};
