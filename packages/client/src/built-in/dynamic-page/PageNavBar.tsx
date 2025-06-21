import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useCompile } from '../../schema-component';
import { useDocumentTitle } from '../document-title';
import { useStyles } from './PageNavBar.style';

const { Title } = Typography;

export const PageNavBar = () => {
  const compile = useCompile();
  const navigate = useNavigate();

  const { styles } = useStyles();
  const { title: documentTitle } = useDocumentTitle();

  // 处理返回操作
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles['page-nav-bar']}>
      <div className="nav-title" onClick={handleBack}>
        <ArrowLeftOutlined />
        <Title level={4} style={{ margin: 0 }}>
          {compile(documentTitle)}
        </Title>
      </div>
    </div>
  );
};
