import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { observer } from '@tachybase/schema';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InternalSubTable } from './InternalSubTable';
import { Button, Drawer } from 'antd';
import { useAssociationFieldContext } from './hooks';
import { ActionContext, ActionContextProvider } from '../action/context';
import { useGetAriaLabelOfPopover } from '../action';
import { ReadPrettyInternalViewer } from './InternalViewer';

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
        <ActionContextProvider value={{ ...ctx, visible, setVisible, openMode: 'drawer' }}>
          <Drawer
            title={t(options?.uiSchema?.rawTitle)}
            open={visible}
            onClose={() => {
              setVisible(false);
            }}
            style={{ backgroundColor: '#f3f3f3' }}
            width={'70%'}
            destroyOnClose
            extra={
              <Button type="primary" onClick={() => setVisible(false)}>
                确认
              </Button>
            }
          >
            <InternalSubTable {...nesterProps} />
          </Drawer>
        </ActionContextProvider>
      </>
    );
  },
  { displayName: 'InternaDrawerSubTable' },
);
