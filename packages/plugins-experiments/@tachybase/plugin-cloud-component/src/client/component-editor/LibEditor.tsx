import React, { useEffect, useRef, useState } from 'react';

import { loader } from '@monaco-editor/react';
import { Button, message, Space, Spin, Tabs } from 'antd';
import { initialize } from 'esbuild-wasm';
import wasmURL from 'esbuild-wasm/esbuild.wasm?url';
import { useNavigate, useParams } from 'react-router-dom';

import ConfigEditor from './components/ConfigEditor';
import { defaultConfigCode, defaultLessCode, defaultMdCode, defaultReactCode } from './components/InitValue';
import LessEditor from './components/LessEditor';
import MDEditor from './components/MDEditor';
import ReactEditor from './components/ReactEditor';

export const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.head.append(script);
  });
};

/**
 * 组件代码编辑
 */
export default () => {
  const reactRef = useRef<any>();
  const cssRef = useRef<any>();
  const configRef = useRef<any>();
  const mdRef = useRef<any>();
  const [tabs, setTabs] = useState<
    Array<{ key: string; label: string; children: React.ReactNode; forceRender?: boolean }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>('react');

  const [cacheAICode, setCacheAICode] = useState<{ jsx: string; config: string } | null>(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const aiChatmRef = useRef<any>();

  // 初始化monaco，默认为jsdelivery分发，由于网络原因改为本地cdn
  loader.config({
    paths: {
      vs: 'https://assets.tachybase.com/monaco-editor@0.52.0/min/vs',
    },
  });

  const items = [
    {
      key: 'react',
      label: 'index.jsx',
      children: <ReactEditor ref={reactRef} />,
    },
    {
      key: 'less',
      label: 'index.less',
      forceRender: true,
      children: <LessEditor ref={cssRef} />,
    },
    {
      key: 'config',
      label: 'config.js',
      forceRender: true,
      children: <ConfigEditor ref={configRef} />,
    },
    {
      key: 'readme.md',
      label: 'readme.md',
      forceRender: true,
      children: <MDEditor ref={mdRef} />,
    },
  ];

  // 加载esbuild-wasm
  const initWasm = async () => {
    try {
      setLoading(true);
      await initialize({
        wasmURL: wasmURL,
      });
      setLoading(false);
      setTabs(items);
    } catch (error) {
      console.error(error);
      message.error('加载wasm失败，请刷新重试');
      setLoading(false);
    }
  };

  useEffect(() => {
    // 如果hash有值，说明已经提交过
    localStorage.setItem('react-code', defaultReactCode);
    localStorage.setItem('less-code', defaultLessCode);
    localStorage.setItem('config-code', defaultConfigCode);
    localStorage.setItem('md-code', defaultMdCode);

    initWasm();
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
    <>
      <Spin spinning={loading} tip="正在编译中...">
        <Tabs
          items={tabs}
          activeKey={activeTabKey}
          tabBarStyle={{ paddingLeft: 65, paddingRight: 30 }}
          onChange={handleTabChange}
          tabBarExtraContent={
            <Space size={20}>
              <Button type="default" onClick={handleBack}>
                返回
              </Button>
            </Space>
          }
        />
      </Spin>
    </>
  );
};
