import { createContext, useContext } from 'react';

export interface ContextMenuContextProps {
  contextMenuEnabled: boolean;
  setContextMenuEnable: (enabled: boolean) => void;
  showScrollArea: boolean;
  setShowScrollArea: (isShow: boolean) => void;
  position: any;
  setPosition: (any) => void;
}

export const ContextMenuContext = createContext<Partial<ContextMenuContextProps>>({});

export const useContextMenu = () => {
  return useContext(ContextMenuContext);
};
