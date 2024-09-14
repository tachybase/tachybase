import React, { useState } from 'react';

import { useApp } from '../../application';
import { ContextMenu, ContextMenuItem, ContextMenuTrigger } from '../../schema-component/common/context-menu';
import { ContextMenuContext } from './useContextMenu';

export const ContextMenuProvider = ({ children }) => {
  const [enable, setEnable] = useState(true);
  const contextItems = useApp().pluginContextMenu.get();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuItems = {
    actions: [],
    childrens: [],
  };
  Object.values(contextItems).forEach((item) => {
    const { actionProps, children: nodeChildren, title } = item.useLoadMethod({ enable, setEnable, position });
    menuItems.actions.push({ title, actionProps });
    menuItems.childrens.push(nodeChildren);
  });

  return (
    <ContextMenuContext.Provider
      value={{
        contextMenuEnabled: enable,
        setContextMenuEnable: setEnable,
        position,
      }}
    >
      <ContextMenu id="my-context-menu-1">
        {menuItems.actions.map((item, index) => (
          <ContextMenuItem {...item.actionProps} key={index}>
            {item.title}
          </ContextMenuItem>
        ))}
      </ContextMenu>
      <ContextMenuTrigger disable={!enable} id="my-context-menu-1" position={position} setPosition={setPosition}>
        {menuItems.childrens.map((children) => children && children())}
        {children}
      </ContextMenuTrigger>
    </ContextMenuContext.Provider>
  );
};
