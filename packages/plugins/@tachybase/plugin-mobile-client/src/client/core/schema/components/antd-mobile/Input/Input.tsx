import React from 'react';
import { css } from '@tachybase/client';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { Input, InputProps, TextArea, TextAreaProps } from 'antd-mobile';

type ComposedInput = React.FC<InputProps> & {
  TextArea?: React.FC<TextAreaProps>;
};

export const MInput: ComposedInput = connect(
  Input,
  mapProps((props) => {
    return { placeholder: '请输入内容', clearable: true, ...props, style: { '--font-size': '12px' } };
  }),
  mapReadPretty((props) => {
    return <text style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.value}</text>;
  }),
);

const MTextArea = connect(
  TextArea,
  mapProps((props) => {
    return { ...props, placeholder: '请输入内容', clearable: true, style: { '--font-size': '12px' } };
  }),
  mapReadPretty((props) => {
    return <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.value}</div>;
  }),
);

MInput.TextArea = MTextArea;
export default MInput;
