import { ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { ACLRolesCheckProvider } from '../acl';
import { PinnedPluginList } from '../pinned-list';

export const AssistantProvider = ({ children }) => {
  return (
    <>
      {children}
      <ACLRolesCheckProvider>
        <FloatButton.Group trigger="hover" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
          <PinnedPluginList belongToFilter="hoverbutton" />
        </FloatButton.Group>
      </ACLRolesCheckProvider>
    </>
  );
};
