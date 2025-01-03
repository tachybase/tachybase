import React from 'react';
import { useCompile, useRecord } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { Field, observer, useField } from '@tachybase/schema';

import { Tag } from 'antd';
import _ from 'lodash';

import { APPROVAL_ACTION_STATUS, approvalStatusConfigObj } from '../../../constants';
import { useTranslation } from '../../../locale';

export const ApprovalRecordStatusColumn = observer(
  () => {
    const { value } = useField<Field>();
    const record = useRecord();
    return <ColumnStatusComponent value={value} record={record} />;
  },
  { displayName: 'ApprovalRecordStatusColumn' },
);

// 审批-待办:状态列:值
export const ColumnStatusComponent = (props) => {
  const { value, record } = props;
  const omitProps = _.omit(props, ['value', 'record']);
  const compile = useCompile();
  const { t } = useTranslation();
  const flow = useFlowContext();
  const { option = approvalStatusConfigObj[value] } = omitProps;
  const { workflow, execution, job } = record ?? {};

  const isWorkFlowEnabled = workflow?.enabled || flow?.workflow?.enabled;
  const isNeedShowUnprocessed = !isWorkFlowEnabled || execution?.stauts || job?.status;

  if (isNeedShowUnprocessed && [APPROVAL_ACTION_STATUS.ASSIGNED, APPROVAL_ACTION_STATUS.PENDING].includes(value)) {
    return <Tag>{t('Unprocessed')}</Tag>;
  }

  return <Tag color={option.color}>{compile(option.label)}</Tag>;
};
