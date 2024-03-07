import { css } from '@emotion/css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToken } from '../style';

export const PoweredBy = () => {
  const { i18n } = useTranslation();
  const { token } = useToken();
  const urls = {
    'en-US': 'https://www.nocobase.com',
    'zh-CN': 'https://cn.nocobase.com',
  };
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div
      className={css`
        text-align: center;
        color: ${token.colorTextDescription};
        a {
          color: ${token.colorTextDescription};
          &:hover {
            color: ${token.colorText};
          }
        }
      `}
    >
      ©2023-{year} 上海道有云网络科技有限公司 版权所有 沪ICP备2023024678号
    </div>
  );
};
