import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';
import { Button, Drawer, Space } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { OpenSize } from '.';
import { useStyles } from './Action.Drawer.style';
import { useActionContext } from './hooks';
import { ComposedActionDrawer } from './types';
import { css } from '@emotion/css';
import { useTranslation } from 'react-i18next';

export const ActionSheet: ComposedActionDrawer = observer(
  (props) => {
    const { footerNodeName = 'Action.Drawer.Footer', ...others } = props;
    const { t } = useTranslation();
    const { visible, setVisible, drawerProps } = useActionContext();
    const schema = useFieldSchema();
    const field = useField();
    const { componentCls, hashId } = useStyles();
    const footerSchema = schema.reduceProperties((buf, s) => {
      if (s['x-component'] === footerNodeName) {
        return s;
      }
      return buf;
    });

    return (
      <Drawer
        placement="bottom"
        height="100%"
        title={field.title}
        {...others}
        {...drawerProps}
        rootStyle={{
          ...drawerProps?.style,
          ...others?.style,
        }}
        destroyOnClose
        open={visible}
        onClose={() => setVisible(false, true)}
        rootClassName={classNames(componentCls, hashId, drawerProps?.className, others.className, 'reset')}
        footer={
          <Space
            className={css`
              width: 100%;
              justify-content: flex-end;
            `}
          >
            <Button type="primary" onClick={() => setVisible(false, true)}>
              {t('Close')}
            </Button>
          </Space>
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
      </Drawer>
    );
  },
  { displayName: 'ActionDrawer' },
);

ActionSheet.Footer = observer(
  () => {
    const field = useField();
    const schema = useFieldSchema();
    return <RecursionField basePath={field.address} schema={schema} onlyRenderProperties />;
  },
  { displayName: 'ActionDrawer.Footer' },
);

export default ActionSheet;
