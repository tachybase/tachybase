import React from 'react';

import { NoticeManagerProvider } from '../../application';
import { RemoteCollectionManagerProvider } from '../../collection-manager';
import { CurrentAppInfoProvider } from '../../common';
import { NavigateIfNotSignIn } from '../../user';
import VariablesProvider from '../../variables/VariablesProvider';
import { ACLRolesCheckProvider } from '../acl';

export const AdminProvider = (props) => {
  return (
    <NoticeManagerProvider>
      <CurrentAppInfoProvider>
        <NavigateIfNotSignIn>
          <RemoteCollectionManagerProvider>
            <VariablesProvider>
              <ACLRolesCheckProvider>{props.children}</ACLRolesCheckProvider>
            </VariablesProvider>
          </RemoteCollectionManagerProvider>
        </NavigateIfNotSignIn>
      </CurrentAppInfoProvider>
    </NoticeManagerProvider>
  );
};
