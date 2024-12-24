import React from 'react';
import { SchemaInitializerItem, useAPIClient, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { CommentOutlined, FireOutlined, HeartOutlined, ReadOutlined, SmileOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender, useXAgent, useXChat } from '@ant-design/x';
import { GetProp, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { useStyle } from './aichatCardStyles';

export const AIchatBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const { t } = useTranslation();
  const itemConfig = useSchemaInitializerItem();

  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<CommentOutlined />}
      onClick={() => {
        insert(aiChatSchema);
      }}
    />
  );
};
// 卡片 schema
export const aiChatSchema: ISchema = {
  type: 'void',
  'x-component': 'CardItem',
  'x-settings': 'blockSettings:aichat',
  properties: {
    aiChatBlock: {
      'x-component': 'AiChatBlock',
    },
  },
};

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '关于灵矶'),
    description: '猜你想知道',
    children: [
      {
        key: '1-1',
        description: `关于平台`,
      },
      {
        key: '1-2',
        description: `我们能做什么`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, '如何开始'),
    description: '猜你想知道',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `信息表单`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `登录组件`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `日期组件`,
      },
    ],
  },
];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
  system: {
    placement: 'start',
    variant: 'shadow',
    styles: {
      content: {
        width: '100%',
      },
    },
  },
};

export const AiChatBlock = () => {
  const { styles } = useStyle();
  const api = useAPIClient();
  const [content, setContent] = React.useState('');

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      const fullContent = await api.request({
        method: 'post',
        url: 'aichat:sendMessage',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { message: message },
      });

      const AIcontent = fullContent.data.data.choices[0].message.content;
      try {
        onSuccess(AIcontent);
      } catch (error) {
        onError(error);
      }
    },
  });

  const onSubmit = (nextContent: string) => {
    //
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const { onRequest, messages } = useXChat({ agent });

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const placeholderNode = (
    <Space direction="vertical" size={20} className={styles.placeholder}>
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    key: id,
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  return (
    <div className={styles.chat}>
      {/* 🌟 消息列表 */}
      <Bubble.List
        items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless', role: 'system' }]}
        roles={roles}
        className={styles.messages}
      />
      {/* 🌟 输入框 */}
      <Sender
        value={content}
        onSubmit={onSubmit}
        onChange={setContent}
        loading={agent.isRequesting()}
        className={styles.sender}
      />
    </div>
  );
};
