import React from 'react';

import { FileFilled } from '@ant-design/icons';
import { saveAs } from 'file-saver';

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

export const imagePng = {
  key: 'image/png',
  type: 'image/png',
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

export const filePdf = {
  key: 'application/pdf',
  type: 'application/pdf',
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
      <div
        {...props}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          height: '100%',
          width: '100%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        <iframe
          src={file.url}
          style={{
            width: '100%',
            maxHeight: '90vh',
            height: '90vh',
            flex: '1 1 auto',
          }}
        />
      </div>
    );
  },
};
