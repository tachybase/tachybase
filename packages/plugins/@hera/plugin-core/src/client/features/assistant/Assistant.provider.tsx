import React from 'react';
import { useDesignable } from '@tachybase/client';

import { CalculatorOutlined, CommentOutlined, HighlightOutlined, ToolFilled, ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

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
