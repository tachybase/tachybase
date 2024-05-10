import React, { useContext, useEffect, useState } from 'react';
import { ActionInitializer } from '@tachybase/client';
import { Switch } from 'antd';
import { useRequest } from '@tachybase/client';
import { AnnotateContext } from '../../hooks/usePdfPath';
export const Annotate = (props) => {
  const { setAnnotate } = useContext(AnnotateContext);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>备注合并:</div>
      <Switch
        checkedChildren="开启"
        unCheckedChildren="关闭"
        onChange={(e) => {
          setAnnotate(e);
        }}
      />
    </div>
  );
};

export const RecordPrintAnnotateActionInitializer = (props) => {
  const schema = {
    title: '{{ t("record print annotate") }}',
    'x-action': 'annotate',
    'x-component': 'Annotate',
    'x-designer': 'Action.Designer',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
