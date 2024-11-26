import React, { useEffect, useState } from 'react';

import { Button } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import './index.less';

import { useApp } from '@tachybase/client';

export const createId = (name: string, len: number = 10) => {
  return (
    name +
    '_' +
    Number(Math.random().toString().substring(2, 12) + Date.now())
      .toString(36)
      .slice(0, len)
  );
};

/**
 * 组件预览
 */
function ComPreview({ config, refreshTag }: { config?: any; refreshTag: number }) {
  const [Component, setComponent] = useState<any>(null);
  const app = useApp();

  // 加载模块
  const loadModule = async () => {
    const reactCompile = localStorage.getItem('react-compile') || '';
    if (!reactCompile) return;
    // 编译后的代码，通过Blob对象来创建URL
    const blob = new Blob([reactCompile], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);

    try {
      app.requirejs.require([url], function (myModule) {
        setComponent(() => myModule.default);
      });
    } catch (error) {
      console.error('模块加载失败:', error);
    }
    // URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadModule();
  }, [config, refreshTag]);

  // 处理绑定变量
  const handleBindVariable = (config: any) => {
    if (!config) return {};
    const props = Object.keys(config.props || {}).reduce<any>((prev, cur) => {
      const variableObj = config.props[cur];
      // 如果组件属性是对象，则判断是静态值还是变量
      if (variableObj?.type === 'static') {
        prev[cur] = variableObj.value;
      } else {
        prev[cur] = variableObj;
      }
      return prev;
    }, {});
    config.props = props;
    return config;
  };

  const id = createId('CPreview');
  const configCompile = localStorage.getItem('config-compile');
  const newConfig = handleBindVariable(config || JSON.parse(configCompile || '{}').config);
  return (
    <div className="preview">
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }: any) => (
          <div>
            <h2>渲染失败，请检查:</h2>
            <p style={{ lineHeight: '30px', color: 'red' }}>{error.message}</p>
            <Button type="primary" onClick={resetErrorBoundary}>
              Try again
            </Button>
          </div>
        )}
      >
        {Component && <Component id={id} config={newConfig} />}
      </ErrorBoundary>
    </div>
  );
}

export default ComPreview;
