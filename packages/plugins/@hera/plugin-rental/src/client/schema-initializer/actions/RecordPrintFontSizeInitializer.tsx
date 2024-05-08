import React, { useContext, useState } from 'react';
import { ActionInitializer } from '@tachybase/client';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { FontSizeContext } from '../../hooks/usePdfPath';
export const PrintFontSize = (props) => {
  const [value, setValue] = useState('9');
  const { setSize } = useContext(FontSizeContext);
  const change = debounce(async (v) => {
    setSize(v);
  }, 2000);
  return (
    <Input
      placeholder=""
      min={1}
      prefix="主字体"
      suffix="px"
      style={{ width: 100 }}
      value={value}
      onChange={(e) => {
        change(e.target.value);
        setValue(e.target.value);
      }}
    />
  );
};

export const PrintFontSizeInitializer = (props) => {
  const schema = {
    title: '{{ t("record print font size") }}',
    'x-action': 'printFontSize',
    'x-component': 'PrintFontSize',
    'x-designer': 'Action.Designer',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
