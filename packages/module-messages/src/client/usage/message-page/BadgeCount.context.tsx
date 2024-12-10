import React from 'react';

const ContextBadgeCount = React.createContext({
  badgeCount: 0,
  changeBadgeCount: () => {},
});

export const ProviderContextBadgeCount = ContextBadgeCount.Provider;

export function useContextBadgeCount() {
  return React.useContext(ContextBadgeCount);
}
