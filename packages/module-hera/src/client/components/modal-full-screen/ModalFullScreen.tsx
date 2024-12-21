import React from 'react';
import { css, cx } from '@tachybase/client';

import ReactDOM from 'react-dom';

import { ModalHeader } from './ModalFullScreenChild';

interface ModalFullScreenProps {
  className?: string;
  title?: string;
  open?: boolean;
  destroyOnClose?: boolean;
  children?: any;
  onOk?: () => void;
  onCancel?: () => void;
}

const ModalFullScreen = (props: ModalFullScreenProps) => {
  const { className, title, open, children, onOk, onCancel } = props;
  if (!open) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      className={cx(
        css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: ${open ? 'flex' : 'none'};
          flex-direction: column;
        `,
        className,
      )}
    >
      <ModalHeader title={title} onOk={onOk} onCancel={onCancel} />
      {children}
    </div>,
    document.body,
  );
};

ModalFullScreen.displayName = 'ModalFullScreen';

export default ModalFullScreen;
