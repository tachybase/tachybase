import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useCompile } from '../../schema-component';
import { useDocumentTitle } from '../document-title';

const { Title } = Typography;

export const PageNavBar = () => {
  const compile = useCompile();
  const navigate = useNavigate();

  const { title: documentTitle } = useDocumentTitle();

  // 处理返回操作
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        background: '#fff',
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* 标题和操作区域 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginRight: 8 }}>
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {compile(documentTitle)}
          </Title>
        </div>
      </div>
    </div>
  );
};
