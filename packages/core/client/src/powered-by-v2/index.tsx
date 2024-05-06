import { css } from '@emotion/css';
import React from 'react';
import { useToken } from '../style';

export const PoweredByV2 = () => {
  const { token } = useToken();
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
      ©2023-{year} TachyBase Team
    </div>
  );
};
