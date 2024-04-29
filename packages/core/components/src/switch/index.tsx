import { Switch as AntdSwitch } from 'antd';
import { connect, mapProps } from '@formily/react';

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
