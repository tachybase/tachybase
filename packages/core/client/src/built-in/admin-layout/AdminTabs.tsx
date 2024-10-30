import React from 'react';

import { useApp } from '../../application';

export const AdminTabs = () => {
  const app = useApp();
  const CustomAdminHeader = app.getComponent('CustomAdminHeader');

  return CustomAdminHeader ? <CustomAdminHeader /> : null;
};
