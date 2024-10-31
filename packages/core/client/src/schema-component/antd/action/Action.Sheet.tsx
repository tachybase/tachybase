import React from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { css } from '@emotion/css';
import { Button, Drawer } from 'antd';
import classNames from 'classnames';

import { Icon } from '../../../icon';
import { useStyles } from './Action.Drawer.style';
import { useActionContext } from './hooks';
import { ComposedActionDrawer } from './types';

export const ActionSheet: ComposedActionDrawer = observer(
  (props) => {
    const { footerNodeName = 'Action.Drawer.Footer', ...others } = props;
    const { visible, setVisible, drawerProps } = useActionContext();
    const schema = useFieldSchema();
    const field = useField();
    const { componentCls, hashId } = useStyles();
    return (
      <Drawer
        placement="bottom"
        height="90%"
        title={field.title}
        {...others}
        {...drawerProps}
        rootStyle={{
          ...drawerProps?.style,
          ...others?.style,
        }}
        extra={
          <>
            <Button
              type="text"
              icon={<Icon type="CloseOutlined" />}
              className={css`
                background: none;
                border: none;
              `}
              onClick={() => setVisible(false, true)}
            />
          </>
        }
        closable={false}
        destroyOnClose
        open={visible}
        onClose={() => setVisible(false, true)}
        rootClassName={classNames(componentCls, hashId, drawerProps?.className, others.className, 'reset')}
        className={`${props.className} amplifier-block`}
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
  { displayName: 'ActionSheet' },
);

ActionSheet.Footer = observer(
  () => {
    const field = useField();
    const schema = useFieldSchema();
    return <RecursionField basePath={field.address} schema={schema} onlyRenderProperties />;
  },
  { displayName: 'ActionSheet.Footer' },
);

export default ActionSheet;
