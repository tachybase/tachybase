import React, { useContext, useEffect, useState } from 'react';
import { ActionInitializer, useRequest } from '@tachybase/client';

import { Radio } from 'antd';

import { PdfIsDoubleContext } from '../../hooks/usePdfPath';

export const ColumnSwitchAction = (props) => {
  const [value, setValue] = useState('0');
  const settingsData = useRequest<any>({
    resource: 'basic_configuration',
    action: 'get',
  });
  const { setIsDouble } = useContext(PdfIsDoubleContext);

  useEffect(() => {
    if (!settingsData.loading) {
      setValue(settingsData.data.data.record_columns);
    }
  }, [settingsData.loading]);
  const values = {
    '0': '切换双列',
    '1': '切换单列',
  };
  const checkColumns = () => {
    if (value === '0') {
      setValue('1');
      setIsDouble('1');
      return '1';
    } else {
      setValue('0');
      setIsDouble('0');
      return '0';
    }
  };
  return (
    <Radio.Button value="default" onClick={checkColumns}>
      {values[value]}
    </Radio.Button>
  );
};

export const ColumnSwitchActionInitializer = (props) => {
  const schema = {
    title: '{{ t("column switch") }}',
    'x-action': 'switchColumn',
    'x-component': 'ColumnSwitchAction',
    'x-designer': 'Action.Designer',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
