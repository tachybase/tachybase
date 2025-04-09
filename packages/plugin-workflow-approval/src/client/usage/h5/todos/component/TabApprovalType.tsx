import React, { useState } from 'react';
import { observer } from '@tachybase/schema';

import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

import { approvalTodoStatusOptions } from '../../../../common/constants/approval-todo-status-options';
import { useTranslation } from '../../../../locale';
import { ExecutionStatusOptions, ProcessedStatus } from '../../constants';

export const TabApprovalType = observer((props) => {
  const { collectionName, params } = props as any;
  const [visible, setVisible] = useState(false);
  const { changeFilter, filter } = props as any;
  const { t } = useTranslation();
  const columns = [];
  if (collectionName === 'approvalRecords') {
    approvalTodoStatusOptions.forEach((item) => {
      if (ProcessedStatus.includes(item.value)) {
        columns.push({
          label: t(item.label),
          value: item.value,
        });
      }
    });
  } else if (collectionName === 'users_jobs') {
    ExecutionStatusOptions.forEach((item) => {
      if (!item.value && item.value !== 0) return;
      columns.push({
        label: t(item.label),
        value: item.value,
      });
    });
  }
  columns.unshift({ label: t('All'), value: 'all' });
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        {columns.length && typeof filter['status'] === 'number'
          ? columns.find((item) => item.value === filter['status']).label
          : '审批状态'}
        <DownOutline />
      </Space>
      <Picker
        columns={[columns]}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={(e) => {
          const changeData = { ...filter };
          if (e[0] === 'all') {
            delete changeData['status'];
          } else {
            changeData['status'] = e[0];
          }
          changeFilter(changeData);
        }}
      />
    </>
  );
});
