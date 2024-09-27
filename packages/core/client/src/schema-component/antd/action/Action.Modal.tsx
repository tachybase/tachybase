import React, { useState } from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button, Modal, ModalProps } from 'antd';
import { createStyles } from 'antd-style';
import classNames from 'classnames';

import { OpenSize, useActionContext } from '.';
import { useSetAriaLabelForModal } from './hooks/useSetAriaLabelForModal';
import { ComposedActionDrawer } from './types';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      &.nb-action-popup {
        .ant-modal-header {
          display: none;
        }

        .ant-modal-content {
          background: var(--tb-box-bg);
        }
      }
    `,
  };
});

const openSizeWidthMap = new Map<OpenSize, string>([
  ['small', '40%'],
  ['middle', '60%'],
  ['large', '80%'],
]);
export const ActionModal: ComposedActionDrawer<ModalProps> = observer(
  (props) => {
    const { footerNodeName = 'Action.Modal.Footer', width, ...others } = props;
    const { styles } = useStyles();
    const { visible, setVisible, openSize = 'middle', modalProps } = useActionContext();
    const actualWidth = width ?? openSizeWidthMap.get(openSize);
    const schema = useFieldSchema();
    const field = useField();
    const footerSchema = schema.reduceProperties((buf, s) => {
      if (s['x-component'] === footerNodeName) {
        return s;
      }
      return buf;
    });

    if (process.env.__E2E__) {
      useSetAriaLabelForModal(visible);
    }

    return (
      <Modal
        width={actualWidth}
        title={field.title}
        {...(others as ModalProps)}
        {...modalProps}
        style={{
          ...modalProps?.style,
          ...others?.style,
        }}
        destroyOnClose
        open={visible}
        closable={false}
        className={classNames(
          others.className,
          modalProps?.className,
          styles.container,
          'amplifier-block',
          css`
            .ant-modal-content {
              padding-top: 32px;
            }
          `,
        )}
        footer={
          footerSchema ? (
            <RecursionField
              basePath={field.address}
              schema={schema}
              onlyRenderProperties
              filterProperties={(s) => {
                return s['x-component'] === footerNodeName;
              }}
            />
          ) : (
            false
          )
        }
      >
        <RecursionField
          basePath={field.address}
          schema={schema}
          onlyRenderProperties
          filterProperties={(s) => {
            return s['x-component'] !== footerNodeName;
          }}
        />
        <div
          className={css`
            position: absolute;
            top: 0;
            right: 5px;
            display: flex;
          `}
        >
          <Amplifier />
          <Button
            icon={<CloseOutlined />}
            className={css`
              background: none;
              border: none;
            `}
            onClick={() => setVisible(false, true)}
          />
        </div>
      </Modal>
    );
  },
  { displayName: 'ActionModal' },
);

ActionModal.Footer = observer(
  () => {
    const field = useField();
    const schema = useFieldSchema();
    return <RecursionField basePath={field.address} schema={schema} onlyRenderProperties />;
  },
  { displayName: 'ActionModal.Footer' },
);

export default ActionModal;

export const Amplifier = () => {
  const [isAmplifier, setIsAmplifier] = useState(false);
  const [blockWidth, setBlockWidth] = useState('');
  return (
    <Button
      icon={isAmplifier ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      className={css`
        background: none;
        border: none;
      `}
      onClick={(e) => {
        const element = e.target.closest('.ant-modal-content');
        const modal = document.querySelector('.ant-modal');
        const mask = document.querySelector('.ant-modal-mask');
        if (isAmplifier) {
          modal.style.width = blockWidth;
          element.style.width = '';
          modal.style.top = '';
          modal.style.padding = '';
          modal.style.margin = '';
          mask.style.backgroundColor = '';
        } else {
          setBlockWidth(modal.getBoundingClientRect().width + 'px');
          element.style.width = '100vw';
          modal.style.width = '100%';
          modal.style.top = '0';
          modal.style.padding = '0';
          modal.style.margin = '0';
          mask.style.backgroundColor = '#f3f3f3';
        }
        setIsAmplifier(!isAmplifier);
      }}
    />
  );
};
