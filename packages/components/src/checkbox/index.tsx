import { connect, mapProps, mapReadPretty } from '@formily/react';
import { Checkbox as AntdCheckbox } from 'antd';

import { PreviewText } from '../preview-text';

const InternalCheckbox = connect(
  AntdCheckbox,
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  }),
);

const Group = connect(
  AntdCheckbox.Group,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(PreviewText.Select, {
    mode: 'tags',
  }),
);

export const Checkbox = Object.assign(InternalCheckbox, {
  __ANT_CHECKBOX: true,
  Group,
});

export default Checkbox;
