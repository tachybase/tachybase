import React from 'react';

import { Outlet, useMatch } from 'react-router';

import { useApp } from '../../application';
import { WelcomeCard } from './components/WelcomeCard';

export const AdminContent = () => {
  const app = useApp();
  const CustomAdminContent = app.getComponent('CustomAdminContent');
  const isMatchAdmin = useMatch('/admin');
  if (isMatchAdmin) {
    return <WelcomeCard />;
  } else {
    return CustomAdminContent ? <CustomAdminContent /> : <Outlet />;
  }
};
