import React, { useRef, useState } from 'react';
import { css, useDesignable } from '@nocobase/client';
import { ContextMenuTrigger } from '../../components/context-menu';
import { ContextMenu } from '../../components/context-menu';
import { ContextMenuItem } from '../../components/context-menu';
import { ContextMenuContext } from './useContextMenu';
import { useJoystick } from './useJoystick';

export const ContextMenuProvider = ({ children }) => {
  const [enable, setEnable] = useState(true);
  const [enableDragable, setEnableDragable] = useState(false);
  const { designable, setDesignable } = useDesignable();
  const ref = useRef<HTMLDivElement>();
  useJoystick(ref);
  return (
    <ContextMenuContext.Provider value={{ contextMenuEnabled: enable, setContextMenuEnable: setEnable }}>
      <ContextMenu id="my-context-menu-1">
        <ContextMenuItem
          onClick={() => {
            setEnableDragable((enable) => !enable);
          }}
        >
          拖动助手
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setDesignable(!designable);
          }}
        >
          设计者模式
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setEnable(!enable);
          }}
        >
          禁用右键菜单
        </ContextMenuItem>
      </ContextMenu>
      <ContextMenuTrigger disable={!enable} id="my-context-menu-1">
        {enableDragable && (
          <div
            ref={ref}
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              z-index: 1000;
              background-color: rgba(141, 141, 113, 0.274);
            `}
          ></div>
        )}
        {children}
      </ContextMenuTrigger>
    </ContextMenuContext.Provider>
  );
};
