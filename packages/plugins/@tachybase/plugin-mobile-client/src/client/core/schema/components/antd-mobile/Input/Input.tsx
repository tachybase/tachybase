import { connect, mapProps } from '@tachybase/schema';
import { Input, InputProps, TextArea, TextAreaProps } from 'antd-mobile';

type ComposedInput = React.FC<InputProps> & {
  TextArea?: React.FC<TextAreaProps>;
};

export const MInput: ComposedInput = connect(
  Input,
  mapProps((props) => {
    return { placeholder: '请输入内容', clearable: true, ...props };
  }),
);

const MTextArea = connect(
  TextArea,
  mapProps((props) => {
    return { placeholder: '请输入内容', ...props };
  }),
);

MInput.TextArea = MTextArea;
export default MInput;
