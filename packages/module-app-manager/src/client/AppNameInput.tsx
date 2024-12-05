import React from 'react';
import { useApp } from '@tachybase/client';
import { connect, mapReadPretty } from '@tachybase/schema';

import { Input as AntdInput } from 'antd';

const ReadPretty = (props) => {
  const app = useApp();
  const content = props.value && (
    <a target={'_blank'} href={app.getRouteUrl(`/apps/${props.value}/admin`)} rel="noreferrer">
      {props.value}
    </a>
  );
  return (
    <div style={props.style}>
      {props.addonBefore}
      {props.prefix}
      {content}
      {props.suffix}
      {props.addonAfter}
    </div>
  );
};

export const AppNameInput = connect(AntdInput, mapReadPretty(ReadPretty));
