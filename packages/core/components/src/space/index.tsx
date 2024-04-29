import { Space as AntdSpace, SpaceProps } from 'antd';
import React from 'react';
import { useFormLayout } from '../form-layout';

export const Space: React.FC<React.PropsWithChildren<SpaceProps>> = (props) => {
  const layout = useFormLayout();
  return React.createElement(AntdSpace, {
    size: props.size ?? layout?.spaceGap,
    ...props,
  });
};

export default Space;
