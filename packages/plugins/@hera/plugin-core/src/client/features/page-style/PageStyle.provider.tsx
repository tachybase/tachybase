import { useCurrentUserContext, useCurrentUserSettingsMenu } from '@nocobase/client';
import React, { createContext, useEffect, useState } from 'react';
import { useTabSettings } from './useTabSettings';
import { TabsProps } from 'antd';

export interface PageStyleContextValue {
  style: string;
  items: TabsProps['items'];
  setItems: React.Dispatch<React.SetStateAction<TabsProps['items']>>;
}

export const PageStyleContext = createContext<Partial<PageStyleContextValue>>({
  style: 'classical',
});

export const PageStyleProvider = ({ children }) => {
  const currentUser = useCurrentUserContext();
  const tabItem = useTabSettings();
  const [items, setItems] = useState<TabsProps['items']>([]);
  const { addMenuItem } = useCurrentUserSettingsMenu();
  useEffect(() => {
    addMenuItem(tabItem, { before: 'divider_3' });
  }, [addMenuItem, tabItem]);

  return (
    <PageStyleContext.Provider
      value={{ style: currentUser.data.data.systemSettings?.pageStyle || 'classical', items, setItems }}
    >
      {children}
    </PageStyleContext.Provider>
  );
};
