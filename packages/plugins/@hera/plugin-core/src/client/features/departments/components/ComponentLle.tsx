import { useField } from '@tachybase/schema';
import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
// import { jsx } from 'react/jsx-runtime';
import { k } from '../others/k';
import { getDepartmentStr } from '../utils/getDepartmentStr';

interface tempField {
  value?: any;
  setValue: Function;
}

interface IState {
  label?: object;
  value?: object;
}

// 编辑部门-上级部门选择器
export const ComponentLle = (props) => {
  const field = useField<tempField>();
  const [value, setValue] = useState<IState>({ label: null, value: null });
  const {
    treeData: treeData,
    initData: initData,
    getByKeyword: getByKeyword,
    loadData: loadData,
    loadedKeys: loadedKeys,
    setLoadedKeys: setLoadedKeys,
    originData: originData,
  } = props;
  const onSearch = (h) =>
    k(this, null, function* () {
      if (!h) {
        initData(originData);
        return;
      }
      yield getByKeyword(h);
    });
  // const b = useCallback((h) => {
  //   const F = h.title,
  //     C = h.parent;
  //   return C ? b(C) + ' / ' + F : F;
  // }, []);

  useEffect(() => {
    initData(originData);
  }, [originData, initData]);
  useEffect(() => {
    if (!field.value) {
      setValue({ label: null, value: null });
      return;
    }
    setValue({
      label: getDepartmentStr(field.value) || field.value.label,
      value: field.value.id,
    });
  }, [field.value, getDepartmentStr]);

  // return null;
  return (
    <TreeSelect
      value={value}
      onSelect={(h, currValue) => {
        field.setValue(currValue);
      }}
      onChange={(h) => {
        h || field.setValue(null);
      }}
      treeData={treeData}
      treeLoadedKeys={loadedKeys}
      onTreeLoad={(keys) => setLoadedKeys(keys)}
      loadData={(value) => loadData({ key: value.id, children: value.children })}
      fieldNames={{ value: 'id' }}
      showSearch={true}
      allowClear={true}
      treeNodeFilterProp={'title'}
      onSearch={onSearch}
      labelInValue={true}
    />
  );
  // return (
  //   useEffect(() => {
  //     c(d);
  //   }, [d, c]),
  //   useEffect(() => {
  //     if (!t.value) {
  //       a({ label: null, value: null });
  //       return;
  //     }
  //     a({ label: b(t.value) || t.value.label, value: t.value.id });
  //   }, [t.value, b]),
  //   jsx(TreeSelect, {
  //     value: o,
  //     onSelect: (h, F) => {
  //       t.setValue(F);
  //     },
  //     onChange: (h) => {
  //       h || t.setValue(null);
  //     },
  //     treeData: r,
  //     treeLoadedKeys: m,
  //     onTreeLoad: (h) => g(h),
  //     loadData: (h) => x({ key: h.id, children: h.children }),
  //     fieldNames: { value: 'id' },
  //     showSearch: true,
  //     allowClear: true,
  //     treeNodeFilterProp: 'title',
  //     onSearch: A,
  //     labelInValue: true,
  //   })
  // );
};
