import React, { useEffect, useImperativeHandle, useState } from 'react';

import {
  CloudUploadOutlined,
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  ReadOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
  Welcome,
  XRequest,
} from '@ant-design/x';
import { Badge, Button, GetProp, Popover, Space, Spin } from 'antd';

import { Icon } from '../../../icon';
import { useStyle } from './chatStyles';

// import styles from './index.module.less';
// import 'dotenv';

const { create } = XRequest({
  baseURL: 'https://api.deepseek.com/chat/completions',
  dangerouslyApiKey: 'Bearer sk-7c91946813cf42b4851a914fe690b0b4',
  model: 'deepseek-chat',
});

interface AIChatModalProps {
  mRef?: any;
  onGenerateLoad: (message: string) => Promise<boolean>;
  onReloadWrite: () => void;
}

interface Example {
  id: string;
  name: string;
  message: string;
}

type StatusType = 'success' | 'info' | 'warning' | 'error';

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

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: 'About tachybase',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
  },
  {
    key: '2',
    description: 'How to start',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />,
  },
];

const defaultConversationsItems = [
  {
    key: '0',
    label: 'What is Ant Design X?',
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
};

export default function AIChatModal({ mRef, onGenerateLoad, onReloadWrite }: AIChatModalProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [content, setContent] = React.useState('');
  const [headerOpen, setHeaderOpen] = React.useState(false);
  const { styles } = useStyle();
  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);
  // const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

  const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>([]);

  const openModal = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setMessage('');
    setShowModal(false);
  };

  const [agent] = useXAgent({
    // request: async ({ message }, { onSuccess }) => {
    //   onSuccess(`Mock success return. You said: ${message}`);
    // },
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate, onSuccess, onError } = callbacks;
      console.log('ssssss', create);
      // current message

      // messages list

      let content: string = '';

      try {
        await create(
          {
            messages: [{ role: 'system', content: message }],
            stream: true,
          },
          {
            onSuccess: (chunks) => {
              onSuccess(content);
            },
            onError: (error) => {
              onError(error);
            },
            onUpdate: (chunk) => {
              let data;
              try {
                data = JSON.parse(chunk.data);
              } catch (error) {
                // Handle the error appropriately, e.g., set `data` to null or an empty object
                data = null; // or data = {};
              }

              // 累加内容
              content += data?.choices[0]?.delta?.content || '';

              // 调用 onUpdate 更新内容
              onUpdate(content);
            },
          },
        );
      } catch (error) {}
    },
  });

  // const { onRequest, messages, setMessages } = useXChat({
  //   agent,
  // });
  const {
    // use to send message
    onRequest,
    // use to render messages
    messages,
    setMessages,
  } = useXChat({ agent });

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
    }
  }, [activeKey]);

  const onSubmit = (nextContent: string) => {
    //
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) => setAttachedFiles(info.fileList);

  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      {/* <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      /> */}
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
    // loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  useImperativeHandle(mRef, () => {
    return {
      openModal,
      handleHideModal,
    };
  });

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
      />
    </Sender.Header>
  );

  return (
    <div className={`${styles.AIChatModal} ${showModal ? styles.showModal : styles.hideModal}`}>
      <div className={styles.modalContent}>
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
          <button className={styles.closeButton} onClick={handleHideModal}>
            &times;
          </button>
        </div>
        <div className={styles.chat}>
          {/* 🌟 消息列表 */}
          <Bubble.List
            items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
            roles={roles}
            className={styles.messages}
          />
          {/* 🌟 提示词 */}
          <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
          {/* 🌟 输入框 */}
          <Sender
            value={content}
            header={senderHeader}
            onSubmit={onSubmit}
            onChange={setContent}
            prefix={attachmentsNode}
            loading={agent.isRequesting()}
            className={styles.sender}
          />
        </div>
      </div>
    </div>
  );
}
