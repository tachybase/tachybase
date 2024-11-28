import React, { useEffect, useState } from 'react';
import { css, useApp } from '@tachybase/client';

import { Button } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';

import { useTranslation } from '../locale';

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
function ComPreview({ compileCode }: { compileCode: string }) {
  const [Component, setComponent] = useState<any>(null);
  const [compileError, setCompileError] = useState('');
  const { t } = useTranslation();
  const app = useApp();

  // 加载模块
  const loadModule = async () => {
    if (!compileCode) return;
    // 编译后的代码，通过Blob对象来创建URL
    const blob = new Blob([compileCode], { type: 'application/javascript' });
    // TODO cleanup URL
    const url = URL.createObjectURL(blob);

    try {
      app.requirejs.require(
        [url],
        function (myModule) {
          setComponent(() => myModule.default);
          setCompileError('');
        },
        function (err) {
          console.error('模块加载失败:', err);
          setCompileError(err.message);
        },
      );
    } catch (error) {
      console.error('模块加载失败:', error);
    }
  };

  useEffect(() => {
    loadModule();
  }, [compileCode]);

  const id = createId('CPreview');
  return (
    <div
      className={css`
        padding: 20px;
        height: 800px;
        overflow: auto;
      `}
    >
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }: any) => (
          <div>
            <h2>{t('Ooops.')}</h2>
            <p style={{ lineHeight: '30px', color: 'red' }}>{error.message}</p>
            <Button type="primary" onClick={resetErrorBoundary}>
              {t('Try again')}
            </Button>
          </div>
        )}
      >
        {!compileError && Component && <Component id={id} />}
        {compileError && (
          <div>
            <h2>{t('Ooops.')}</h2>
            <p style={{ lineHeight: '30px', color: 'red' }}>{compileError}</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default ComPreview;
