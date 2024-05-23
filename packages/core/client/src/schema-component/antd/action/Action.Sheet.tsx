import React from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { Button, Drawer, Space } from 'antd';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { useStyles } from './Action.Drawer.style';
import { useActionContext } from './hooks';
import { ComposedActionDrawer } from './types';

const useStyles2 = createStyles(({ css }) => {
  return {
    container: css`
      width: 100%;
      justify-content: flex-end;
    `,
  };
});

export const ActionSheet: ComposedActionDrawer = observer(
  (props) => {
    const { footerNodeName = 'Action.Drawer.Footer', ...others } = props;
    const { t } = useTranslation();
    const { visible, setVisible, drawerProps } = useActionContext();
    const schema = useFieldSchema();
    const field = useField();
    const { componentCls, hashId } = useStyles();
    const { styles } = useStyles2();
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
          <Space className={styles.container}>
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
