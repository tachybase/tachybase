import { ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useLocation } from 'react-router-dom';

import { ACLRolesCheckProvider } from '../acl';
import { PinnedPluginList } from '../pinned-list';

export const AssistantProvider = ({ children }) => {
  const location = useLocation();
  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return <>{children}</>;
  }
  return (
    <>
      {children}
      <ACLRolesCheckProvider>
        <FloatButton.Group trigger="click" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
          <PinnedPluginList belongToFilter="hoverbutton" />
        </FloatButton.Group>
      </ACLRolesCheckProvider>
    </>
  );
};
