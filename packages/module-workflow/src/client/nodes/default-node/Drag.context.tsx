import React, { useContext } from 'react';

const ContextDrag = React.createContext<any>({
  isDraggable: true,
  setIsDraggable: () => {},
});

export const ProviderContextDrag = ContextDrag.Provider;

export function useContextDrag() {
  return useContext(ContextDrag);
}
