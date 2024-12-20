import React, { useState } from 'react';

import { useLocalStorageState } from 'ahooks';
import { Dropdown, type MenuProps } from 'antd';

import { useApp } from '../../application';
import { ContextMenuContext } from './useContextMenu';

const STORAGE_KEYS = {
  HIDDEN_SCROLL_AREA: 'hidden-scroll-area',
  CONTEXT_MENU_ENABLED: 'context-menu-enabled',
} as const;

export const ContextMenuProvider = ({ children }) => {
  const [enable, setEnable] = useLocalStorageState<boolean>(STORAGE_KEYS.CONTEXT_MENU_ENABLED, {
    defaultValue: true,
  });
  const [hiddenScrollArea, setHiddenScrollArea] = useLocalStorageState<boolean>(STORAGE_KEYS.HIDDEN_SCROLL_AREA, {
    defaultValue: false,
  });

  const contextItems = useApp().pluginContextMenu.get();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const items: MenuProps['items'] = [];

  const contextItemsSorted = Object.values(contextItems).sort((a, b) => (a.sort || 0) - (b.sort || 0));

  contextItemsSorted.forEach((item) => {
    const { actionProps, title, icon } = item.useLoadMethod({
      enable,
      setEnable,
      hiddenScrollArea,
      setHiddenScrollArea,
      position,
    });
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
        hiddenScrollArea,
        setHiddenScrollArea,
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
