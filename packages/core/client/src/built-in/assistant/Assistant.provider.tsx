import React from 'react';
import { Icon, useContextMenu, useDesignable, useHotkeys } from '@tachybase/client';

import {
  CalculatorOutlined,
  CommentOutlined,
  HighlightOutlined,
  SearchOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';

import { useCalculator } from './calculator/CalculatorProvider';
import { useSearchAndJump } from './search-and-jump';

export const AssistantProvider = ({ children }) => {
  const { designable, setDesignable } = useDesignable();
  const { visible, setVisible } = useCalculator();
  const { setOpen } = useSearchAndJump();

  // 快捷键切换编辑状态
  useHotkeys('Ctrl+Shift+U', () => setDesignable(!designable), [designable]);
  useHotkeys('Ctrl+K', () => setOpen((open) => !open), []);
  useHotkeys('Cmd+K', () => setOpen((open) => !open), []);

  const { contextMenuEnabled, setContextMenuEnable } = useContextMenu();
  return (
    <>
      {children}
      <FloatButton.Group trigger="hover" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <FloatButton icon={<SearchOutlined />} onClick={() => setOpen(true)} />
        <FloatButton
          icon={<Icon type="Design" />}
          type={designable ? 'primary' : 'default'}
          onClick={() => setDesignable(!designable)}
        />
        <FloatButton
          type={visible ? 'primary' : 'default'}
          icon={<CalculatorOutlined />}
          onClick={() => {
            setVisible((visible) => !visible);
          }}
        />
        <FloatButton icon={<CommentOutlined />} />
        <FloatButton
          type={contextMenuEnabled ? 'primary' : 'default'}
          icon={<ToolOutlined onClick={() => setContextMenuEnable(!contextMenuEnabled)} />}
        />
      </FloatButton.Group>
    </>
  );
};
