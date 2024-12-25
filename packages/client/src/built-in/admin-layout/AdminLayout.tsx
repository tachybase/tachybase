import React from 'react';

import { AdminProvider } from './AdminProvider';
import { InternalAdminLayout } from './InternalAdminLayout';
import { NoticeArea } from './NoticeArea';

export const AdminLayout = (props) => {
  return (
    <AdminProvider>
      <NoticeArea />
      <InternalAdminLayout {...props} />
    </AdminProvider>
  );
};
