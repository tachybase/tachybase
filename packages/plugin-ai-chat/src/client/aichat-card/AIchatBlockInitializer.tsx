import React from 'react';
import { SchemaInitializerItem, useAPIClient, useSchemaInitializer, useSchemaInitializerItem } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { CommentOutlined, FireOutlined, HeartOutlined, ReadOutlined, SmileOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender, useXAgent, useXChat } from '@ant-design/x';
import { GetProp, Space } from 'antd';

import { useTranslation } from '../locale';
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

export const AiChatBlock = () => {
  const { styles } = useStyle();
  const api = useAPIClient();
  const [content, setContent] = React.useState('');
  const { t } = useTranslation();

  const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, t('About Tachybase')),
      description: t('Guess you want'),
      children: [
        {
          key: '1-1',
          description: t('About Platform'),
        },
        {
          key: '1-2',
          description: t('What Can We Do'),
        },
      ],
    },
    {
      key: '2',
      label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, t('How To Start')),
      description: t('Guess you want'),
      children: [
        {
          key: '2-1',
          icon: <HeartOutlined />,
          description: t('InformationForm'),
        },
        {
          key: '2-2',
          icon: <SmileOutlined />,
          description: t('LoginComponent'),
        },
        {
          key: '2-3',
          icon: <CommentOutlined />,
          description: t('DateComponent'),
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

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      try {
        const fullContent = await api.request({
          method: 'post',
          url: 'aichat:sendMessage',
          headers: {
            'Content-Type': 'application/json',
          },
          data: { message: message },
        });
        const AIcontent = fullContent.data.data.choices[0].message.content;
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
