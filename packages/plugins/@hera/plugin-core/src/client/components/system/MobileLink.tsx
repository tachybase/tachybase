import React from 'react';
import { css } from '@tachybase/client';

import { MobileOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { useTranslation } from '../../locale';

export const MobileLink = () => {
  const { t } = useTranslation();
  return (
    <div
      className={css`
        .ant-btn {
          border: 0;
          height: 46px;
          width: 46px;
          border-radius: 0;
          background: none;
          color: rgba(255, 255, 255, 0.65) !important;
          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }
        }
      `}
      style={{ display: 'inline-block' }}
    >
      <Tooltip title={t('Mobile UI')} placement="bottom">
        <Button role="button" href="/mobile">
          <MobileOutlined />
        </Button>
      </Tooltip>
    </div>
  );
};
