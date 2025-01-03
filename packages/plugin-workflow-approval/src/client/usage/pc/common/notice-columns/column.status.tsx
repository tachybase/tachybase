import { useCompile, useRecord } from '@tachybase/client';
import { EXECUTION_STATUS } from '@tachybase/module-workflow/client';
import { Field, observer, useField } from '@tachybase/schema';

import { Tag } from 'antd';
import _ from 'lodash';

import { NAMESPACE, useTranslation } from '../../../../locale';

export const ColumnStatus = observer(
  () => {
    const { value } = useField<Field>();
    const record = useRecord();
    return <ColumnStatusComponent value={value} record={record} />;
  },
  { displayName: 'ColumnStatus' },
);

export const ColumnStatusComponent = (props) => {
  const { value, record } = props;
  const omitProps = _.omit(props, ['value', 'record']);
  const compile = useCompile();
  const { t } = useTranslation();
  const { option = approvalStatusConfigObj[value] } = omitProps;
  const { workflow, execution, job } = record ?? {};

  return (!workflow?.enabled || execution?.stauts || job?.status) && [].includes(value) ? (
    <Tag>{t('Unprocessed')}</Tag>
  ) : (
    <Tag color={option?.color}>{compile(option?.label)}</Tag>
  );
};

export const approvalStatusOptions = [
  { value: EXECUTION_STATUS.QUEUEING, label: `{{t("Assigned", { ns: "${NAMESPACE}" })}}`, color: 'blue' },
  { value: EXECUTION_STATUS.STARTED, label: `{{t("Pending", { ns: "${NAMESPACE}" })}}`, color: 'gold' },
  // { value: EXECUTION_STATUS.RETURNED, label: `{{t("Returned", { ns: "${NAMESPACE}" })}}`, color: 'purple' },
  { value: 2, label: `{{t("Approved", { ns: "${NAMESPACE}" })}}`, color: 'green' },
  { value: EXECUTION_STATUS.REJECTED, label: `{{t("Rejected", { ns: "${NAMESPACE}" })}}`, color: 'red' },
  // { value: EXECUTION_STATUS.WITHDRAWN, label: `{{t("Withdrawn", { ns: "${NAMESPACE}" })}}` },
];
const approvalStatusConfigObj = approvalStatusOptions.reduce(
  (e, t) =>
    Object.assign(e, {
      [t.value]: t,
    }),
  {},
);
