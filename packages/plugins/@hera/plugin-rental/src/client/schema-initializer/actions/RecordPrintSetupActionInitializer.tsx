import React, { useContext, useEffect, useState } from 'react';
import { ActionInitializer } from '@nocobase/client';
import { Radio, RadioChangeEvent } from 'antd';
import { useRequest } from '@nocobase/client';
import { PdfIsLoadContext } from '../../hooks/usePdfPath';
export const PrintSetup = (props) => {
  const [value, setValue] = useState('');
  const settingsData = useRequest<any>({
    resource: 'basic_configuration',
    action: 'get',
  });
  useEffect(() => {
    if (!settingsData.loading) {
      setValue(settingsData.data.data.record_print_setup);
    }
  }, [settingsData.loading]);
  const options = [
    { label: '人工录入', value: '0' },
    { label: '全部', value: '1' },
    { label: '全部(金额)', value: '2' },
  ];
  const Settings = () => {
    const { setSettingLoad } = useContext(PdfIsLoadContext);
    const onChange = async ({ target: { value } }: RadioChangeEvent) => {
      setValue(value);
      setSettingLoad((settingType) => (settingType = value));
    };
    return (
      <>
        <Radio.Group options={options} onChange={onChange} value={value} optionType="button" />
      </>
    );
  };
  return <Settings />;
};

export const RecordPrintSetupActionInitializer = (props) => {
  const schema = {
    title: '{{ t("record print setup") }}',
    'x-action': 'printSetup',
    'x-component': 'PrintSetup',
    'x-designer': 'Action.Designer',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
