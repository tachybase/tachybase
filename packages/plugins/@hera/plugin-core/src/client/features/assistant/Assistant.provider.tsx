import React from 'react';
import { css, useDesignable } from '@tachybase/client';

import { CalculatorOutlined, CommentOutlined, HighlightOutlined, ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { createPortal } from 'react-dom';

import { useContextMenu } from '../context-menu/useContextMenu';
import { CalculatorWrapper } from './calculator/Calculator';

export const AssistantProvider = ({ children }) => {
  const { designable, setDesignable } = useDesignable();
  const { contextMenuEnabled, setContextMenuEnable } = useContextMenu();
  return (
    <>
      {children}
      <FloatButton.Group trigger="hover" type="default" style={{ right: 24, zIndex: 1250 }} icon={<ToolOutlined />}>
        <FloatButton
          icon={<HighlightOutlined />}
          type={designable ? 'primary' : 'default'}
          onClick={() => setDesignable(!designable)}
        />
        <FloatButton
          icon={<CalculatorOutlined />}
          onClick={() => {
            createPortal(
              // <div
              //   className={css`
              //     position: fixed;
              //     top: 0;
              //     left: 0;
              //     width: 1000px;
              //     height: 1000px;
              //     z-index: 9999;
              //     background-color: red;
              //   `}
              // >
              //   <div />
              //   {/* <CalculatorWrapper /> */}
              // </div>,
              <div
                className={css`
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 9000;
                  display: 'flex';
                  flex-direction: column;
                `}
              >
                dsfasdfasfasdfadsf
              </div>,
              document.body,
            );
            alert('---');
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
