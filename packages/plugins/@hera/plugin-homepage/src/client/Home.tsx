import React from 'react';

import { Button, Col, Image, Row } from 'antd';

import { useStyles } from './style';

export const HomePage: React.FC<{}> = () => {
  const { styles } = useStyles();
  const onClick = () => {
    window.location.href = '/admin';
  };
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className={styles.home}>
      <header>
        <Row className="headerStyle">
          <Col span={4}>
            <span className="headerTitle">上海创兴建筑设备租赁有限公司</span>
          </Col>
          <Col span={15}>
            <ul>
              <li className="active">公司简介</li>
              <li>新闻中心</li>
              <li>产品展示</li>
              <li>工程案例</li>
              <li>联系我们</li>
            </ul>
          </Col>
          <Col span={5}>
            <Button type="primary" onClick={onClick}>
              管理系统入口
            </Button>
          </Col>
        </Row>
      </header>
      <main>
        <Image
          preview={false}
          src="https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/de1b13e4e7f31e4b6c012f9290aff6dc.jpg"
        />
        <Button onClick={onClick}>管理系统入口</Button>
      </main>
      <footer>
        ©2023-{year} 上海道有云网络科技有限公司 版权所有{' '}
        <a href="https://beian.miit.gov.cn/" className="beian">
          沪ICP备2023024678号
        </a>
      </footer>
    </div>
  );
};
