import { Modal, Toast, Image } from 'antd-mobile';
import React from 'react';
import downloadImage from '../assets/download.svg';

export const showModal = () => {
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
  return <Image style={{ flex: 1 }} src={downloadImage} width="100%" />;
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
