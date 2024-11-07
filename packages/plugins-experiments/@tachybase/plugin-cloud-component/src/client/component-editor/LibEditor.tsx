import React, { useEffect, useRef, useState } from 'react';

import { Spin, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';

import { defaultMdCode, defaultReactCode } from './components/InitValue';
import MDEditor from './components/MDEditor';
import ReactEditor from './components/ReactEditor';

/**
 * 组件代码编辑
 */
export default () => {
  const reactRef = useRef<any>();
  const cssRef = useRef<any>();
  const configRef = useRef<any>();
  const mdRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>('react');

  const navigate = useNavigate();

  const items = [
    {
      key: 'react',
      label: 'index.jsx',
      children: <ReactEditor ref={reactRef} />,
    },
    {
      key: 'readme.md',
      label: 'readme.md',
      forceRender: true,
      children: <MDEditor ref={mdRef} />,
    },
  ];

  useEffect(() => {
    // 如果hash有值，说明已经提交过
    localStorage.setItem('react-code', defaultReactCode);
    localStorage.setItem('md-code', defaultMdCode);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    switch (key) {
      case 'react':
        reactRef.current?.refresh();
        break;
      case 'less':
        cssRef.current?.refresh();
        break;
      case 'config':
        configRef.current?.refresh();
        break;
    }
  };

  // 返回
  const handleBack = () => {
    navigate('/libs');
  };

  return (
    <Spin spinning={loading} tip="正在编译中...">
      <Tabs
        items={items}
        activeKey={activeTabKey}
        tabBarStyle={{ paddingLeft: 65, paddingRight: 30 }}
        onChange={handleTabChange}
      />
    </Spin>
  );
};
