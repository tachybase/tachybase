import React, { createContext, useContext } from 'react';

interface ContextMenuContext {
  contextMenuEnabled: boolean;
  setContextMenuEnable: (enabled: boolean) => void;
  position: any;
  setPosition: (any) => void;
}

export const ContextMenuContext = createContext<Partial<ContextMenuContext>>({});

export const useContextMenu = () => {
  return useContext(ContextMenuContext);
};