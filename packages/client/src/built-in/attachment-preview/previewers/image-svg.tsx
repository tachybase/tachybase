import React from 'react';

export const imageSvg = {
  key: 'image/svg+xml',
  type: 'image/svg+xml',
  viewComponet: (props) => {
    const { file, prefixCls } = props;
    return file.imageUrl && <img src={`${file.url}`} />;
  },
  checkedComponent: (props) => {
    const { file } = props;
    return file.imageUrl && <img {...props} src={`${file.url}`} />;
  },
};
