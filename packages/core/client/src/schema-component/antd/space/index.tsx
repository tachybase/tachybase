import { useFormLayout } from '@tachybase/components';
import { Space as AntdSpace, Divider, SpaceProps } from 'antd';
import React from 'react';

export const Space: React.FC<SpaceProps> = (props) => {
  let { split } = props;
  if (split === '|') {
    split = <span>&nbsp;</span>;
  }
  const layout = useFormLayout();
  return React.createElement(AntdSpace, {
    size: props.size ?? layout?.spaceGap,
    ...props,
    split,
  });
};

export default Space;
