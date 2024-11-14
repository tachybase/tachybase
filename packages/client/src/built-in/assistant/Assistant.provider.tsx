import React, { useRef } from 'react';

import { CalculatorOutlined, CommentOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';

import { Icon } from '../../icon';
import { useDesignable } from '../../schema-component';
import { useContextMenu } from '../context-menu';
import AIChatModal from './AIChatModal';
import { useCalculator } from './calculator/CalculatorProvider';
import { useSearchAndJump } from './search-and-jump';

export const AssistantProvider = ({ children }) => {
  const { designable, setDesignable } = useDesignable();
  const { visible, setVisible } = useCalculator();
  const { setOpen } = useSearchAndJump();

  const ref = useRef<any>();

  // 快捷键切换编辑状态
  useHotkeys('Ctrl+Shift+U', () => setDesignable(!designable), [designable]);
  useHotkeys('Ctrl+K', () => setOpen((open) => !open), []);
  useHotkeys('Cmd+K', () => setOpen((open) => !open), []);

  const { contextMenuEnabled, setContextMenuEnable } = useContextMenu();
  return (
    <>
      {children}
      <AIChatModal mRef={ref} onGenerateLoad={async (msg) => true} onReloadWrite={() => {}} />
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
        <FloatButton
          icon={<CommentOutlined />}
          onClick={() => {
            ref.current?.openModal();
          }}
        />
        <FloatButton
          type={contextMenuEnabled ? 'primary' : 'default'}
          icon={<ToolOutlined onClick={() => setContextMenuEnable(!contextMenuEnabled)} />}
        />
      </FloatButton.Group>
    </>
  );
};
