import React, { useContext, useEffect, useState } from 'react';
import { ActionInitializer, useAPIClient } from '@tachybase/client';
import { Input } from 'antd';
import { useRequest } from '@tachybase/client';
import { PdfMargingTopContext } from '../../hooks/usePdfPath';
import { debounce } from 'lodash';
import { useCurrentUserContext } from '@tachybase/client';
export const PrintSetupMargingTop = (props) => {
  const { data } = useCurrentUserContext();
  const userId = data.data?.id;
  const api = useAPIClient();
  const [value, setValue] = useState('0');
  const { setMargingTop } = useContext(PdfMargingTopContext);
  const users = useRequest<any>({
    resource: 'users',
    action: 'get',
    params: {
      filter: {
        id: userId,
      },
    },
  });
  useEffect(() => {
    if (!users.loading) {
      setValue(users.data.data?.pdf_top_margin || 0);
    }
  }, [users.loading]);

  const change = debounce(async (v) => {
    await api.resource('users').update({
      filter: {
        id: userId,
      },
      values: {
        pdf_top_margin: Number(v),
      },
    });
    setMargingTop(v);
  }, 2000);

  return (
    <Input
      placeholder=""
      prefix="距上"
      suffix="像素"
      style={{ width: 100 }}
      value={value}
      onChange={(e) => {
        change(e.target.value);
        setValue(e.target.value);
      }}
    />
  );
};

export const RecordPrintSetupMargingTopInitializer = (props) => {
  const schema = {
    title: '{{ t("record print setup margingTop") }}',
    'x-action': 'printSetupMargingTop',
    'x-component': 'PrintSetupMargingTop',
    'x-designer': 'Action.Designer',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
