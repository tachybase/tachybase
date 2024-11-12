import React from 'react';

import { useTranslation } from '../../locale';

export const ErrorBoundaryFallBack = () => {
  const { t } = useTranslation();
  // 如果有错误，展示备用, 可以通过fallback回调自定义,或者显示默认 UI 组件
  return <div>{t('Something went wrong. Please contact the developer to resolve the issue.')}</div>;
};
