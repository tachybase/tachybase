import React, { useContext, useState } from 'react';

import { SchemaComponentOptions, useActionContext, useBlockRequestContext, useCollection } from '../../../';
import {
  TableSelectorParamsProvider,
  useTableSelectorProps as useTsp,
} from '../../../block-provider/TableSelectorProvider';
import { RecordPickerContext, RecordPickerProvider } from '../../../schema-component/antd/record-picker';

const useTableSelectorProps = () => {
  const { setSelectedRows } = useContext(RecordPickerContext);
  const { onRowSelectionChange, rowKey = 'id', ...others } = useTsp();
  return {
    ...others,
    rowKey,
    rowSelection: {
      type: 'checkbox',
    },
    onRowSelectionChange(selectedRowKeys, selectedRows) {
      setSelectedRows?.(selectedRowKeys);
      onRowSelectionChange?.(selectedRowKeys, selectedRows);
    },
  };
};

export const AssociateActionProvider = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const collection = useCollection();
  const { resource, service, block, __parent } = useBlockRequestContext();

  const pickerProps = {
    size: 'small',
    onChange: props?.onChange,
    selectedRows,
    setSelectedRows,
  };
  const usePickActionProps = () => {
    const { selectedRows } = useContext(RecordPickerContext);
    const { setVisible, setFormValueChanged } = useActionContext();
    return {
      async onClick(e?, callBack?) {
        await resource.add({
          values: selectedRows,
        });
        if (callBack) {
          callBack?.();
        }
        setVisible?.(false);
        if (block && block !== 'TableField') {
          __parent?.service?.refresh?.();
          setVisible?.(false);
          setFormValueChanged?.(false);
        }
      },
    };
  };
  const getFilter = () => {
    const targetKey = collection?.filterTargetKey || 'id';
    if (service.data?.data) {
      const list = service.data?.data.map((option) => option[targetKey]).filter(Boolean);
      const filter = list.length ? { $and: [{ [`${targetKey}.$ne`]: list }] } : {};
      return filter;
    }
    return {};
  };
  return (
    <RecordPickerProvider {...pickerProps}>
      <SchemaComponentOptions scope={{ useTableSelectorProps, usePickActionProps }}>
        <TableSelectorParamsProvider params={{ filter: getFilter() }}>{props.children}</TableSelectorParamsProvider>
      </SchemaComponentOptions>
    </RecordPickerProvider>
  );
};
