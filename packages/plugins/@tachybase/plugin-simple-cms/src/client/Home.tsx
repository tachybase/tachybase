import React from 'react';

import { Button, Col, Image, Row } from 'antd';

import { useStyles } from './style';

export const HomePage = () => {
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
            <span className="headerTitle">Tachybase</span>
          </Col>
          <Col span={15}>
            <ul>
              <li className="active">建设中</li>
              <li>建设中</li>
              <li>建设中</li>
              <li>建设中</li>
              <li>建设中</li>
            </ul>
          </Col>
          <Col span={5}>
            <Button type="primary" onClick={onClick}>
              管理系统入口
            </Button>
          </Col>
        </Row>
      </header>
    </div>
  );
};
