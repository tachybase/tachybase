import React from 'react';

import { FileFilled } from '@ant-design/icons';

export const fileDef = {
  key: 'default',
  type: 'default',
  viewComponet: (props) => {
    const { prefixCls } = props;
    return (
      <FileFilled
        className={`${prefixCls}-list-item-image`}
        style={{ width: '100%', height: '100%', lineHeight: '100%', color: '#000000' }}
      />
    );
  },
  checkedComponent: (props) => {
    return (
      <div {...props}>
        <FileFilled style={{ color: '#ffffff', fontSize: '30rem', display: 'block', lineHeight: '100vh' }} />
      </div>
    );
  },
};
