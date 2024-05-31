import React from 'react';

import { Tag } from 'antd';

export const TreeNode = (props) => {
  const { tag, type } = props;
  const text = {
    reference: 'Reference',
    duplicate: 'Duplicate',
    preloading: 'Preloading',
  };
  const colors = {
    reference: 'blue',
    duplicate: 'green',
    preloading: 'cyan',
  };
  return (
    <div>
      <Tag color={colors[type]}>
        <span>{tag}</span> ({text[type]})
      </Tag>
    </div>
  );
};
