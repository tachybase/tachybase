import { useCompile, useRecord } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { Field, observer, useField } from '@tachybase/schema';

import { Tag } from 'antd';
import _ from 'lodash';

import { useTranslation } from '../../../../locale';
import { APPROVAL_ACTION_STATUS, approvalStatusConfigObj } from '../../constants';

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
  const { option = approvalStatusConfigObj[value] } = omitProps;
  const { execution, job } = record ?? {};

  const isNeedShowUnprocessed = execution?.status || job?.status;

  if ([APPROVAL_ACTION_STATUS.ASSIGNED, APPROVAL_ACTION_STATUS.PENDING].includes(value) && isNeedShowUnprocessed) {
    return <Tag>{t('Unprocessed')}</Tag>;
  }

  return <Tag color={option.color}>{compile(option.label)}</Tag>;
};
