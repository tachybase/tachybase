import { CalculatorOutlined, CommentOutlined, HighlightOutlined, ToolOutlined, ToolFilled } from '@ant-design/icons';
import { useDesignable } from '@tachybase/client';
import { FloatButton } from 'antd';
import React from 'react';
import { useContextMenu } from '../context-menu/useContextMenu';
export const AssistantProvider = ({ children }) => {
  const { designable, setDesignable } = useDesignable();
  const { contextMenuEnabled, setContextMenuEnable } = useContextMenu();
  const ContextMenuIcon = contextMenuEnabled ? ToolFilled : ToolOutlined;
  return (
    <>
      {children}
      <FloatButton.Group trigger="hover" type="primary" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <FloatButton icon={<HighlightOutlined />} onClick={() => setDesignable(!designable)} />
        <FloatButton icon={<CalculatorOutlined />} />
        <FloatButton icon={<CommentOutlined />} />
        <FloatButton icon={<ContextMenuIcon onClick={() => setContextMenuEnable(!contextMenuEnabled)} />} />
      </FloatButton.Group>
    </>
  );
};
