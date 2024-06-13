import React from 'react';
import { css, useApp } from '@tachybase/client';

import { LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useTranslation } from '../locale';

export const OpenInNewTab = () => {
  const { t } = useTranslation();
  const app = useApp();

  const onOpenInNewTab = () => {
    window.open(app.getRouteUrl('/mobile'));
  };

  return (
    <div
      className={css`
        position: absolute;
        top: -40px;
        right: 0;
      `}
    >
      <Button type="dashed" onClick={onOpenInNewTab} icon={<LinkOutlined />}>
        {t('Preview')}
      </Button>
    </div>
  );
};
