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
    return (
      <Input
        {...props}
        readOnly
        className={css`
          .adm-text-area-element {
            font-size: 12px;
          }
        `}
      />
    );
  }),
);

const MTextArea = connect(
  TextArea,
  mapProps((props) => {
    return { ...props, placeholder: '请输入内容', clearable: true, style: { '--font-size': '12px' } };
  }),
  mapReadPretty((props) => {
    return (
      <TextArea
        {...props}
        readOnly
        className={css`
          .adm-text-area-element {
            font-size: 12px;
          }
        `}
      />
    );
  }),
);

MInput.TextArea = MTextArea;
export default MInput;
