import React from 'react';
import { PinnedPluginListProvider, SchemaComponentOptions } from '@tachybase/client';

import { CommentOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import { useAIchat } from './ai-chat/AIchatModalProvider';

const AIChatButton = () => {
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
    <PinnedPluginListProvider
      items={{
        ai: { order: 330, component: 'AIChatButton', pin: true, isPublic: true, belongTo: 'hoverbutton' },
      }}
    >
      <SchemaComponentOptions
        components={{
          AIChatButton,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </PinnedPluginListProvider>
  );
};
