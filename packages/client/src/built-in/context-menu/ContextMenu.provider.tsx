import React, { useState } from 'react';

import { useLocalStorageState } from 'ahooks';
import { Dropdown, type MenuProps } from 'antd';

import { useApp } from '../../application';
import { ContextMenuContext } from './useContextMenu';

export const ContextMenuProvider = ({ children }) => {
  const [enable, setEnable] = useLocalStorageState<boolean>('context-menu-enabled', {
    defaultValue: true,
  });
  const contextItems = useApp().pluginContextMenu.get();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const items: MenuProps['items'] = [];

  // XXX: 是否有办法将这个计算缓存, 以及下边那个遍历缓存.
  const contextItemsSorted = Object.values(contextItems).sort((a, b) => (a.sort || 0) - (b.sort || 0));

  contextItemsSorted.forEach((item) => {
    const { actionProps, title, icon } = item.useLoadMethod({ enable, setEnable, position });
    items.push({
      label: title,
      key: title,
      icon: icon,
      onClick: actionProps.onClick,
    });
  });

  return (
    <ContextMenuContext.Provider
      value={{
        contextMenuEnabled: enable,
        setContextMenuEnable: setEnable,
        position,
      }}
    >
      <Dropdown menu={{ items }} trigger={enable ? ['contextMenu'] : []}>
        <div
          onContextMenu={(e) => {
            setPosition({
              x: e.clientX,
              y: e.clientY,
            });
          }}
        >
          {children}
        </div>
      </Dropdown>
    </ContextMenuContext.Provider>
  );
};
