import React, { useEffect, useState } from 'react';
import { useAPIClient } from '@tachybase/client';
import { observer, useFieldSchema } from '@tachybase/schema';

import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

import { useTranslation } from '../locale';

export const ApprovalTemplateType = observer((props) => {
  const { changeFilter, filter } = props as any;
  const [visible, setVisible] = useState(false);
  const [columns, setColumns] = useState([]);
  const api = useAPIClient();
  const { t } = useTranslation();
  useEffect(() => {
    api
      .request({
        url: 'workflows:list',
        params: { pageSize: 9999, filter: { type: { $eq: 'approval' }, enabled: { $eq: true } } },
      })
      .then((res) => {
        const columnsData = res.data.data.map((value) => {
          return { label: value.title?.replace('审批流:', '') || '', value: value.id };
        });
        columnsData.unshift({
          value: 'all',
          label: t('All'),
        });
        setColumns(columnsData);
      })
      .catch(() => {
        console.error;
      });
  }, []);
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        {columns.length && filter?.workflowId && filter?.workflowId !== 'all'
          ? columns.find((item) => item.value === filter.workflowId).label
          : '模版类型'}
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
            delete changeData['workflowId'];
          } else {
            changeData['workflowId'] = e[0];
          }
          changeFilter(changeData);
        }}
      />
    </>
  );
});
