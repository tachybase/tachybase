import React from 'react';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { Input, InputProps, TextArea, TextAreaProps } from 'antd-mobile';

type ComposedInput = React.FC<InputProps> & {
  TextArea?: React.FC<TextAreaProps>;
};

export const MInput: ComposedInput = connect(
  Input,
  mapProps((props) => {
    return { placeholder: '请输入内容', clearable: true, ...props, style: { fontSize: '12px' } };
  }),
  mapReadPretty((props) => {
    return <Input {...props} readOnly style={{ fontSize: '12px' }} />;
  }),
);

const MTextArea = connect(
  TextArea,
  mapProps((props) => {
    return { ...props, placeholder: '请输入内容', clearable: true, style: { fontSize: '12px' } };
  }),
  mapReadPretty((props) => {
    return <TextArea {...props} readOnly style={{ fontSize: '12px' }} />;
  }),
);

MInput.TextArea = MTextArea;
export default MInput;
