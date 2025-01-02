import React, { useEffect, useState } from 'react';
import { useField } from '@tachybase/schema';

import { TreeSelect } from 'antd';

import { getDepartmentStr } from '../../utils/getDepartmentStr';

interface tempField {
  value?: any;
  setValue: Function;
}

interface IState {
  label?: object;
  value?: object;
}

// 编辑部门-上级部门选择器
export const InternalSuperiorDepartmentSelect = (props) => {
  const field = useField<tempField>();
  const [value, setValue] = useState<IState>({ label: null, value: null });

  const { treeData, initData, getByKeyword, loadData, loadedKeys, setLoadedKeys, originData } = props;

  const onSearch = async (keyword) => {
    if (!keyword) {
      initData(originData);
      return;
    }
    await getByKeyword(keyword);
  };

  useEffect(() => {
    initData(originData);
  }, [originData, initData]);

  useEffect(() => {
    if (!field.value) {
      setValue({
        label: null,
        value: null,
      });
      return;
    }

    setValue({
      label: getDepartmentStr(field.value) || field.value.label,
      value: field.value.id,
    });
  }, [field.value]);

  return (
    <TreeSelect
      value={value}
      onSelect={(value, currValue) => {
        field.setValue(currValue);
      }}
      onChange={(value) => {
        value || field.setValue(null);
      }}
      treeData={treeData}
      treeLoadedKeys={loadedKeys}
      onTreeLoad={(keys) => setLoadedKeys(keys)}
      loadData={(value) =>
        loadData({
          key: value.id,
          children: value.children,
        })
      }
      fieldNames={{ value: 'id' }}
      showSearch={true}
      allowClear={true}
      treeNodeFilterProp={'title'}
      onSearch={onSearch}
      labelInValue={true}
    />
  );
};
