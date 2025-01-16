import { ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { PinnedPluginList } from '../pinned-list';

export const AssistantProvider = ({ children }) => {
  return (
    <>
      {children}
      <FloatButton.Group trigger="click" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <PinnedPluginList belongToFilter="hoverbutton" />
      </FloatButton.Group>
    </>
  );
};
