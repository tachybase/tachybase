import { connect, mapProps } from '@tachybase/schema';

import { Switch as AntdSwitch } from 'antd';

export const Switch = connect(
  AntdSwitch,
  mapProps(
    {
      value: 'checked',
    },
    (props) => {
      delete props['value'];
      return {
        ...props,
      };
    },
  ),
);

export default Switch;
