import { Modal, Toast, Image, Button } from 'antd-mobile';
import { ShareAltOutlined } from '@ant-design/icons';
import React from 'react';
import downloadImage from '../assets/download.svg';
import { CustomComponentType } from '@hera/plugin-core/client';

export const ShareProduct = () => {
  return (
    <Button
      style={{
        alignSelf: 'center',
        fontSize: 16,
      }}
      color="primary"
      size="small"
      block
      onClick={showModal}
    >
      分享产品
      <ShareAltOutlined />
    </Button>
  );
};

ShareProduct.displayName = 'ShareProduct';
ShareProduct.__componentType = CustomComponentType.CUSTOM_FORM_ITEM;
ShareProduct.__componentLabel = '移动端-三聪头-分享产品';

const showModal = () => {
  Modal.show({
    bodyStyle: {
      background: 'transparent',
    },
    content: <ImageShow />,
    closeOnMaskClick: true,
    actions: [
      {
        key: 'share',
        text: '复制推广链接',
        primary: true,
      },
    ],
    onAction: async () => {
      await copyHrefToClipboard();
      Toast.show('复制成功!');
    },
  });
};

const ImageShow = () => {
  return <Image style={{ flex: 1 }} src={downloadImage} width="100%" fit="scale-down" />;
};

async function copyHrefToClipboard() {
  const location = window.location;
  const href = location.href;
  try {
    await navigator.clipboard.writeText(href);
    console.log('文本已复制到剪贴板', href);
  } catch (err) {
    console.error('无法复制文本: ', err);
  }
}
