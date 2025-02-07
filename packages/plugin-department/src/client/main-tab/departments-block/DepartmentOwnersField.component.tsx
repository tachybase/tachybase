import React, { useEffect, useRef, useState } from 'react';
import { ActionContextProvider, useActionContext, useRecord } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Select } from 'antd';

import { ViewUnKnownOwerns } from './UnknownOwerns.view';

/**
 * 部门编辑表单-负责人
 * @returns 部门负责人字段组件
 */
export const DepartmentOwnersField = () => {
  const [visible, setVisible] = useState(false);
  const record = useRecord();
  const field: any = useField();
  const [value, setValue] = useState([]);
  const ref = useRef([]);

  const handleSelect = (d, currValue) => {
    ref.current = currValue;
  };

  const useSelectOwners = () => {
    const { setVisible } = useActionContext();
    return {
      onClick() {
        const fieldValue = field.value || [];
        field.setValue([...fieldValue, ...ref.current]);
        ref.current = [];
        setVisible(false);
      },
    };
  };

  useEffect(() => {
    if (field.value) {
      const fieldValue = field.value.map((item) => ({
        value: item.id,
        label: item.nickname || item.username,
      }));
      setValue(fieldValue);
    }
  }, [field.value]);

  return (
    <ActionContextProvider value={{ visible, setVisible }}>
      <Select
        open={false}
        mode={'multiple'}
        value={value}
        labelInValue={true}
        onChange={(params) => {
          if (!params) {
            field.setValue([]);
            return;
          } else {
            const values = params.map(({ label, value }) => ({
              id: value,
              nickname: label,
            }));

            field.setValue(values);
          }
        }}
        onDropdownVisibleChange={(visible) => setVisible(visible)}
      />
      <ViewUnKnownOwerns record={record} field={field} handleSelect={handleSelect} useSelectOwners={useSelectOwners} />
    </ActionContextProvider>
  );
};
