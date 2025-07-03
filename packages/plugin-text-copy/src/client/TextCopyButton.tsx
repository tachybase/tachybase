import { useRef } from 'react';
import { useToken } from '@tachybase/client';
import { observer, useField, type Field } from '@tachybase/schema';

import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';

export const TextCopyButton = observer(
  () => {
    const field = useField<Field>();
    const { token } = useToken();
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const hidden = field.readPretty && !field.value;

    const handleCopy = async () => {
      if (!field.value) {
        message.warning('没有可复制的内容');
        return;
      }

      try {
        await navigator.clipboard.writeText(String(field.value));
        message.success('复制成功');
      } catch (error) {
        // 降级方案：使用传统的复制方法
        const textArea = document.createElement('textarea');
        textArea.value = String(field.value);
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          message.success('复制成功');
        } catch (fallbackError) {
          message.error('复制失败');
        }
        document.body.removeChild(textArea);
      }
    };

    return (
      <div
        ref={buttonRef}
        style={{
          marginLeft: field.readPretty ? token.marginXXS : 0,
          opacity: hidden ? 0 : 1,
          cursor: 'pointer',
          padding: token.paddingXXS,
          borderRadius: token.borderRadiusSM,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={handleCopy}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="复制文本"
      >
        <CopyOutlined style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }} />
      </div>
    );
  },
  {
    displayName: 'TextCopyButton',
  },
);

export const renderTextCopyButton = () => {
  if (TextCopyButton) {
    return <TextCopyButton />;
  }
  return null;
};
