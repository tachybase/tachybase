import { Outlet } from 'react-router';

import { useApp } from '../../application';

export const AdminContent = () => {
  const app = useApp();
  const CustomAdminContent = app.getComponent('CustomAdminContent');
  return CustomAdminContent ? <CustomAdminContent /> : <Outlet />;
};
