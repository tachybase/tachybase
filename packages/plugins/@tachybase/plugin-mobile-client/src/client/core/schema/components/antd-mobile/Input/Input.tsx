import React from 'react';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { Input, InputProps, TextArea, TextAreaProps } from 'antd-mobile';

type ComposedInput = ((props: InputProps) => React.ReactNode) & {
  TextArea?: (props: TextAreaProps) => React.ReactNode;
};

export const MInput: ComposedInput = connect(
  Input,
  mapProps((props) => {
    return { placeholder: '请输入内容', clearable: true, ...props, style: { '--font-size': '12px' } };
  }),
  mapReadPretty((props) => {
    return <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.value}</span>;
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
