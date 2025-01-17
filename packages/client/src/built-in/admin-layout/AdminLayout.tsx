import { ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { PinnedPluginList } from '../pinned-list';
import { AdminProvider } from './AdminProvider';
import { InternalAdminLayout } from './InternalAdminLayout';
import { NoticeArea } from './NoticeArea';

export const AdminLayout = (props) => {
  return (
    <AdminProvider>
      <NoticeArea />
      <InternalAdminLayout {...props} />
      <FloatButton.Group trigger="click" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <PinnedPluginList belongToFilter="hoverbutton" />
      </FloatButton.Group>
    </AdminProvider>
  );
};
