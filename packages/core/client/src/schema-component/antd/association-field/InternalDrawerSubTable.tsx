import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { observer } from '@nocobase/schema';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InternalSubTable } from './InternalSubTable';
import { Button, Drawer } from 'antd';
import { useAssociationFieldContext } from './hooks';
import { ActionContext, ActionContextProvider } from '../action/context';
import { useGetAriaLabelOfPopover } from '../action';
import { ReadPrettyInternalViewer } from './InternalViewer';
import { useSetAriaLabelForPopover } from '../action/hooks/useSetAriaLabelForPopover';

export const InternaDrawerSubTable = observer(
  (props) => {
    const { options } = useAssociationFieldContext();
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const ref = useRef();
    const nesterProps = {
      ...props,
      shouldMountElement: true,
    };

    const titleProps = {
      ...props,
      enableLink: true,
    };

    const ctx = useContext(ActionContext);
    const { getAriaLabel } = useGetAriaLabelOfPopover();

    if (process.env.__E2E__) {
      useSetAriaLabelForPopover(visible);
    }
    return (
      <>
        <span
          style={{ cursor: 'pointer', display: 'flex' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          <div
            className={css`
              max-width: 95%;
            `}
          >
            <ReadPrettyInternalViewer {...titleProps} />
          </div>
          <EditOutlined style={{ display: 'inline-flex', marginLeft: '5px' }} />
        </span>
        {visible && (
          <div
            role="button"
            aria-label={getAriaLabel('mask')}
            onClick={() => setVisible(false)}
            className={css`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: transparent;
              z-index: 9999;
            `}
          />
        )}
        <ActionContextProvider value={{ ...ctx, visible, setVisible, openMode: 'drawer' }}>
          <Drawer
            title={t(options?.uiSchema?.rawTitle)}
            open={visible}
            onClose={() => {
              setVisible(false);
            }}
            style={{ backgroundColor: '#f3f3f3' }}
            width={800}
            destroyOnClose
            footer={
              <div style={{ marginLeft: '90%' }}>
                <Button type="primary" onClick={() => setVisible(false)}>
                  确认
                </Button>
              </div>
            }
          >
            <div
              ref={ref}
              style={{ minWidth: '600px', maxWidth: '800px', maxHeight: '440px', overflow: 'auto' }}
              className={css`
                min-width: 600px;
                max-height: 440px;
                overflow: auto;
                .ant-card {
                  border: 0px;
                }
              `}
            >
              <InternalSubTable {...nesterProps} />
            </div>
          </Drawer>
        </ActionContextProvider>
      </>
    );
  },
  { displayName: 'InternaDrawerSubTable' },
);
