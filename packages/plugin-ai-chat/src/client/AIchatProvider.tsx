import React, { useRef } from 'react';
import { AssistantListProvider, SchemaComponentOptions } from '@tachybase/client';

import { CalculatorOutlined, CommentOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { useAIchat } from './ai-chat/AIchatModalProvider';

const AIChatButton = () => {
  // const ref = useRef<any>();
  const { setOpen } = useAIchat();

  return (
    <FloatButton
      icon={<CommentOutlined />}
      onClick={() => {
        setOpen(true);
      }}
    />
  );
};

export const AIchatProvider = (props) => {
  return (
    <AssistantListProvider
      items={{
        ai: { order: 200, component: 'AIChatButton', pin: true, isPublic: true },
      }}
    >
      <SchemaComponentOptions
        components={{
          AIChatButton,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </AssistantListProvider>
  );
};
