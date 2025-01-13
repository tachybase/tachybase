import React, { createContext, useContext, useState } from 'react';
import { useAPIClient, useCompile } from '@tachybase/client';

import { CommentOutlined, FireOutlined, HeartOutlined, ReadOutlined, SmileOutlined } from '@ant-design/icons';
import { Bubble, Prompts, Sender, useXAgent, useXChat } from '@ant-design/x';
import { GetProp, Modal, Space } from 'antd';

import { useTranslation } from '../locale';
import { useStyle } from './chatStyles';

export const AIchatContext = createContext({
  open: false,
  setOpen: (open: boolean | ((open: boolean) => boolean)) => {},
});

export const AIchatModalProvider = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <AIchatContext.Provider value={{ open, setOpen }}>
      {children}
      <AIchat open={open} setOpen={setOpen} />
    </AIchatContext.Provider>
  );
};

export const useAIchat = () => {
  return useContext(AIchatContext);
};

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

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

export const AIchat = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const { styles } = useStyle();
  const api = useAPIClient();
  const [content, setContent] = React.useState('');

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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

  const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      description: t('About Tachybase'),
      icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    },
    {
      key: '2',
      description: t('How To Start'),
      icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
  ];

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
    messageRender: (content: string) => {
      const formattedContent = content.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
      return <>{formattedContent}</>;
    },
  }));

  return (
    <Modal
      className={styles.AIChatModal}
      closable={false}
      mask={false}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <div className={styles.modalHeader}>
        <div className={styles.title}>
          <svg className={styles.marsailogo} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M370.812121 400.290909c-21.721212 0-38.787879 17.066667-38.787879 38.787879V605.090909c0 21.721212 17.066667 38.787879 38.787879 38.787879s38.787879-17.066667 38.787879-38.787879V439.078788c0-21.721212-17.066667-38.787879-38.787879-38.787879zM712.145455 417.357576c-15.515152-15.515152-38.787879-15.515152-54.303031 0L589.575758 485.624242c-9.309091 9.309091-13.963636 21.721212-12.412122 34.133334-1.551515 12.412121 3.10303 24.824242 12.412122 32.581818l68.266666 68.266667c7.757576 7.757576 17.066667 10.860606 27.927273 10.860606s20.169697-4.654545 27.927273-10.860606 10.860606-17.066667 10.860606-27.927273-4.654545-20.169697-10.860606-27.927273l-46.545455-46.545454 46.545455-46.545455c13.963636-13.963636 13.963636-38.787879-1.551515-54.30303z"
              fill="#7d33ff"
            ></path>
            <path
              d="M788.169697 228.072727c-57.406061-27.927273-161.357576-48.09697-273.066667-49.648485-111.709091 1.551515-217.212121 20.169697-274.618182 49.648485-88.436364 41.890909-124.121212 128.775758-124.121212 297.890909 0 134.981818 37.236364 232.727273 100.848485 266.860606 82.230303 41.890909 156.70303 55.854545 296.339394 55.854546 141.187879 0 215.660606-13.963636 294.787879-54.30303 65.163636-35.684848 102.4-134.981818 102.4-268.412122 0-167.563636-37.236364-256-122.569697-297.890909z m44.993939 296.339394c0 114.812121-31.030303 183.078788-60.509091 200.145455-58.957576 29.478788-117.915152 44.993939-259.10303 44.993939-139.636364 0-200.145455-15.515152-260.654545-44.993939-29.478788-15.515152-58.957576-85.333333-58.957576-200.145455 0-134.981818 23.272727-200.145455 79.127273-229.624242 46.545455-23.272727 142.739394-40.339394 240.484848-40.339394 97.745455 1.551515 193.939394 18.618182 240.484849 40.339394 55.854545 29.478788 79.127273 94.642424 79.127272 229.624242z"
              fill="#7d33ff"
            ></path>
          </svg>
          <span>TachyAI</span>
        </div>
        <button className={styles.closeButton} onClick={handleCancel}>
          &times;
        </button>
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless', role: 'system' }]}
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          onSubmit={onSubmit}
          onChange={setContent}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </Modal>
  );
};
