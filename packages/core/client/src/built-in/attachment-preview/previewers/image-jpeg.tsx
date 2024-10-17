import React from 'react';

export const imagejpeg = {
  key: 'image/jpeg',
  type: 'image/jpeg',
  viewComponet: (props) => {
    const { file, prefixCls } = props;
    return (
      file.imageUrl && (
        <img
          src={`${file.imageUrl}${file.thumbnailRule || ''}`}
          style={{ width: '100%', height: '100%' }}
          alt={file.title}
          className={`${prefixCls}-list-item-image`}
        />
      )
    );
  },
  checkedComponent: (props) => {
    const { file } = props;
    return (
      file.imageUrl && (
        <img
          {...props}
          src={`${file.imageUrl}${file.thumbnailRule || ''}`}
          alt={file.title}
          style={{
            width: '90%',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )
    );
  },
};
