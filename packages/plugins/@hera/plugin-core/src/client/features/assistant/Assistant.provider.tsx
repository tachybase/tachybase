import { CalculatorOutlined, CommentOutlined, HighlightOutlined, ToolOutlined } from '@ant-design/icons';
import { useDesignable } from '@nocobase/client';
import { FloatButton } from 'antd';
import React from 'react';
export const AssistantProvider = ({ children }) => {
  const { designable, setDesignable } = useDesignable();
  return (
    <>
      {children}
      <FloatButton.Group trigger="hover" type="primary" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <FloatButton icon={<HighlightOutlined />} onClick={() => setDesignable(!designable)} />
        <FloatButton icon={<CalculatorOutlined />} />
        <FloatButton icon={<CommentOutlined />} />
      </FloatButton.Group>
    </>
  );
};
