import React, { useContext, useEffect } from 'react';
import { useResourceActionContext } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Table } from 'antd';

import { useTranslation } from '../locale';
import { useGetDepTree } from '../main-tab/hooks/useGetDepTree';
import { getDepartmentStr } from '../utils/getDepartmentStr';
import { useContextFilterKeys } from './FilterKeys.context';

const useDisabledDefault = () => ({
  disabled: () => false,
});

export const InternalDepartmentTable = ({ useDisabled = useDisabledDefault }) => {
  const { t } = useTranslation();
  const service = useResourceActionContext();

  const { run, data, loading, defaultRequest } = service;
  const { resource, resourceOf, params } = defaultRequest || {};
  const { treeData, initData, loadData } = useGetDepTree({ resource, resourceOf, params });

  const field: any = useField();
  const { disabled: disabled } = useDisabled();

  const { hasFilter, expandedKeys, setExpandedKeys } = useContextFilterKeys();

  useEffect(() => {
    if (!hasFilter) {
      initData(data?.data);
    }
  }, [data, initData, loading, hasFilter]);

  const { count, page, pageSize } = data?.meta || {};

  const paginationParams: any = {
    defaultPageSize: params?.pageSize,
    total: count,
    current: page,
    pageSize: pageSize,
  };

  return (
    <Table
      rowKey={'id'}
      columns={[
        {
          dataIndex: 'title',
          title: t('Department name'),
          render: (text, record) => (hasFilter ? getDepartmentStr(record) : text),
        },
      ]}
      rowSelection={{
        selectedRowKeys: (field?.value || []).map((fieldValue) => fieldValue.id),
        onChange: (selectedRowKeys, selectedRows) => {
          return field?.setValue?.(selectedRows);
        },
        getCheckboxProps: () => ({ disabled: disabled() }),
      }}
      pagination={{
        ...paginationParams,
        showSizeChanger: true,
        onChange(f, S) {
          let O;
          run({
            ...(service?.params?.[0] || {}),
            page: f,
            pageSize: S,
          });
        },
      }}
      dataSource={hasFilter ? data?.data || [] : treeData}
      expandable={{
        onExpand: (expanded, r) => {
          // FIXME 这里类型应该不会错了，是 antd 版本变化的影响吗？确认一下
          const record = r as unknown as any;
          loadData({
            key: record.id,
            children: record.children,
          });
        },
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange: (expandedRows) => setExpandedKeys(expandedRows),
      }}
    />
  );
};
