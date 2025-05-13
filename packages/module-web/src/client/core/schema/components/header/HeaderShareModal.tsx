import { useState } from 'react';
import { Icon, useShareActions, useTranslation } from '@tachybase/client';

import { Modal } from 'antd';

import { useModalStyles } from './style';

export const ShareModal = ({ open, setOpen, title = '', uid }) => {
  const [imageOpen, setImageOpen] = useState(false);
  const { styles: modalStyle } = useModalStyles();
  const { t } = useTranslation();
  const { copyLink, imageAction } = useShareActions({ title, uid });

  return (
    <Modal
      open={open}
      className={modalStyle.firstmodal}
      title={t('Share')}
      footer={null}
      width={300}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <div className={modalStyle.secondmodal}>
        <div className="tb-header-modal-list" onClick={copyLink}>
          <Icon type="PaperClipOutlined" />
          {t('Copy link')}
        </div>
        <div
          className="tb-header-modal-list"
          onClick={() => {
            setImageOpen(true);
          }}
        >
          <Icon type="QrcodeOutlined" />
          {t('Generate QR code')}
        </div>
      </div>
      <Modal
        className={modalStyle.imageModal}
        open={imageOpen}
        footer={null}
        onCancel={() => {
          setImageOpen(false);
        }}
      >
        {imageAction()}
      </Modal>
    </Modal>
  );
};
