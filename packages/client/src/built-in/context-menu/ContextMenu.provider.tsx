import React, { useState } from 'react';

// import { AssistantListProvider, SchemaComponentOptions } from '@tachybase/client';
import { ToolOutlined } from '@ant-design/icons';
import { useLocalStorageState } from 'ahooks';
import { Dropdown, FloatButton, type MenuProps } from 'antd';

import { useApp } from '../../application';
import { SchemaComponentOptions } from '../../schema-component';
import { PinnedPluginListProvider } from '../pinned-list';
// import { AssistantListProvider } from '../assistant';
import { ContextMenuContext, useContextMenu } from './useContextMenu';

const STORAGE_KEYS = {
  SHOW_SCROLL_AREA: 'show-scroll-area',
  CONTEXT_MENU_ENABLED: 'context-menu-enabled',
} as const;

export const ContextMenuProvider = ({ children }) => {
  const [enable, setEnable] = useLocalStorageState<boolean>(STORAGE_KEYS.CONTEXT_MENU_ENABLED, {
    defaultValue: true,
  });
  const [showScrollArea, setShowScrollArea] = useLocalStorageState<boolean>(STORAGE_KEYS.SHOW_SCROLL_AREA, {
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
      showScrollArea,
      setShowScrollArea,
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
        showScrollArea,
        setShowScrollArea,
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

const ContextMenuButton = () => {
  const { contextMenuEnabled, setContextMenuEnable } = useContextMenu();

  return (
    <FloatButton
      type={contextMenuEnabled ? 'primary' : 'default'}
      icon={<ToolOutlined />}
      onClick={() => setContextMenuEnable(!contextMenuEnabled)}
    />
  );
};

export const ContextMenuButtonProvider = (props) => {
  return (
    <PinnedPluginListProvider
      items={{
        cm: { order: 90, component: 'ContextMenuButton', pin: true, isPublic: true, belongTo: 'hoverbutton' },
      }}
    >
      <SchemaComponentOptions
        components={{
          ContextMenuButton,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
