import React from 'react';

import { FileFilled } from '@ant-design/icons';

import { AttachmentPreviewParams } from '../interface';

export const fileDef = {
  key: 'default',
  type: 'default',
  viewComponet: (params: AttachmentPreviewParams) => {
    const { mimetype, file } = params;
    switch (true) {
      case RegExp('image/').test(mimetype || file?.mimetype):
        return <ViewComponentImageDefault {...params} />;
      default:
        return <ViewComponentDefault {...params} />;
    }
  },
  checkedComponent: (params: AttachmentPreviewParams) => {
    const { mimetype, file } = params;
    switch (true) {
      case RegExp('image/').test(mimetype || file?.mimetype):
        return <CheckedComponentImageDefault {...params} />;
      default:
        return <CheckedComponentDefault {...params} />;
    }
  },
};

/** 图像类型的默认展示组件 */
const ViewComponentImageDefault = (props) => {
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
};

/** 图像类型的默认预览组件 */
const CheckedComponentImageDefault = (props) => {
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
};

/** 未知类型的文件展示组件 */
const ViewComponentDefault = (props) => {
  const { prefixCls } = props;
  return (
    <FileFilled
      className={`${prefixCls}-list-item-image`}
      style={{ width: '100%', height: '100%', lineHeight: '100%', color: '#000000' }}
    />
  );
};
/** 未知类型的文件预览组件 */
const CheckedComponentDefault = (props) => {
  return (
    <div>
      <FileFilled style={{ color: '#ffffff', fontSize: '30rem', display: 'block', lineHeight: '100vh' }} />
    </div>
  );
};
