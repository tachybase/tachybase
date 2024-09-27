import React, { useState } from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { ArrowsAltOutlined, CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Button, Drawer } from 'antd';
import classNames from 'classnames';

import { OpenSize } from './';
import { useStyles } from './Action.Drawer.style';
import { useActionContext } from './hooks';
import { useSetAriaLabelForDrawer } from './hooks/useSetAriaLabelForDrawer';
import { ComposedActionDrawer } from './types';

const openSizeWidthMap = new Map<OpenSize, string>([
  ['small', '30%'],
  ['middle', '50%'],
  ['large', '70%'],
]);
export const ActionDrawer: ComposedActionDrawer = observer(
  (props) => {
    const { footerNodeName = 'Action.Drawer.Footer', ...others } = props;
    const { visible, setVisible, openSize = 'middle', drawerProps } = useActionContext();
    const schema = useFieldSchema();
    const field = useField();
    const { componentCls, hashId } = useStyles();
    const footerSchema = schema.reduceProperties((buf, s) => {
      if (s['x-component'] === footerNodeName) {
        return s;
      }
      return buf;
    });

    if (process.env.__E2E__) {
      useSetAriaLabelForDrawer(visible);
    }

    return (
      <Drawer
        width={openSizeWidthMap.get(openSize)}
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
          footerSchema && (
            <div className={'footer'}>
              <RecursionField
                basePath={field.address}
                schema={schema}
                onlyRenderProperties
                filterProperties={(s) => {
                  return s['x-component'] === footerNodeName;
                }}
              />
            </div>
          )
        }
        className={`${props.className} ${css`
          position: relative;
          padding-top: 30px;
        `} amplifier-block`}
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
      </Drawer>
    );
  },
  { displayName: 'ActionDrawer' },
);

ActionDrawer.Footer = observer(
  () => {
    const field = useField();
    const schema = useFieldSchema();
    return <RecursionField basePath={field.address} schema={schema} onlyRenderProperties />;
  },
  { displayName: 'ActionDrawer.Footer' },
);

export default ActionDrawer;

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
        const element = e.target.closest('.ant-drawer-content-wrapper');
        if (isAmplifier) {
          element.style.width = blockWidth;
        } else {
          setBlockWidth(element.getBoundingClientRect().width + 'px');
          element.style.width = '100%';
        }
        setIsAmplifier(!isAmplifier);
      }}
    />
  );
};
