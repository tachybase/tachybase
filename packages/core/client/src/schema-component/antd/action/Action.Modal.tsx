import React from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { Modal, ModalProps } from 'antd';
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
          background: var(--nb-box-bg);
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
        onCancel={() => setVisible(false, true)}
        className={classNames(others.className, modalProps?.className, styles.container)}
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
