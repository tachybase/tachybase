import React, { useState } from 'react';

import { Dropdown, theme, type MenuProps } from 'antd';

import { useApp } from '../../application';
import { ContextMenuContext } from './useContextMenu';

export const ContextMenuProvider = ({ children }) => {
  const [enable, setEnable] = useState(true);
  const contextItems = useApp().pluginContextMenu.get();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuItems = {
    actions: [],
    childrens: [],
  };
  const items: MenuProps['items'] = [];
  Object.values(contextItems).forEach((item) => {
    const { actionProps, children: nodeChildren, title } = item.useLoadMethod({ enable, setEnable, position });
    menuItems.actions.push({ title, actionProps });
    menuItems.childrens.push(nodeChildren);
    items.push({
      label: title,
      key: title,
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
