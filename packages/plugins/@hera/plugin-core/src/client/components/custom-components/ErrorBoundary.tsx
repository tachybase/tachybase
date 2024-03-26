import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../locale';

export const ErrorBoundary = ({ children, fallback }) => {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 捕获子组件的错误
    const handleError = (error) => {
      console.error('Error caught by ErrorBoundary:', error);
      setHasError(true);
    };

    // TODO: 或者上报至错误服务器,记录
    // 添加错误处理函数到 window
    window.addEventListener('error', handleError);
    // 移除事件监听器
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // 如果有错误，展示备用, 可以通过fallback回调自定义,或者显示默认 UI 组件
  if (hasError) {
    return fallback ? fallback : <div>{t('Something went wrong. Please try again later.')}</div>;
  }

  // 否则渲染子组件
  return children;
};
