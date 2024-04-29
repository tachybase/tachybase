import { connect, mapProps, mapReadPretty } from '@formily/react';
import { Radio as AntdRadio } from 'antd';
import { PreviewText } from '../preview-text';

export const InternalRadio = connect(
  AntdRadio,
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  }),
);

const Group = connect(
  AntdRadio.Group,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(PreviewText.Select),
);

export const Radio = Object.assign(InternalRadio, {
  __ANT_RADIO: true,
  Group,
});

export default Radio;
