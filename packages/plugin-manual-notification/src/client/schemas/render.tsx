import { useCompile } from '@tachybase/client';

import { Space, Tag, Typography } from 'antd';

export function OptionRender({ data }) {
  const { label, color, description } = data;
  const compile = useCompile();
  return (
    <Space direction="vertical">
      <Tag color={color}>{compile(label)}</Tag>
      <Typography.Text type="secondary" style={{ whiteSpace: 'normal' }}>
        {compile(description)}
      </Typography.Text>
    </Space>
  );
}
