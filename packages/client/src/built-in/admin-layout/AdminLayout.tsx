import React from 'react';

import { InternalAdminLayout } from '.';
import { AdminProvider } from './AdminProvider';
import { NoticeArea } from './NoticeArea';

export const AdminLayout = (props) => {
  return (
    <AdminProvider>
      <NoticeArea />
      <InternalAdminLayout {...props} />
    </AdminProvider>
  );
};
