import { createContext, useContext } from 'react';

export interface ContextMenuContextProps {
  contextMenuEnabled: boolean;
  setContextMenuEnable: (enabled: boolean) => void;
  hiddenScrollArea: boolean;
  setHiddenScrollArea: (isHidden: boolean) => void;
  position: any;
  setPosition: (any) => void;
}

export const ContextMenuContext = createContext<Partial<ContextMenuContextProps>>({});

export const useContextMenu = () => {
  return useContext(ContextMenuContext);
};
