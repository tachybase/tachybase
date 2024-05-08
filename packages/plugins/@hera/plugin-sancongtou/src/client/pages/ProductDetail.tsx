import { NavBar, Image } from 'antd-mobile';
import React from 'react';
import detailHeaderImpage from '../assets/detail_lt_header.png';
import detailContentImage from '../assets/detail_lt_content.png';
import { css } from '@tachybase/client';

export const ProductDetail = () => {
  const onBack = () => {
    const history = window.history;
    history.back();
  };

  return (
    <>
      <NavBar
        className={css`
          .adm-nav-bar-left,
          .adm-nav-bar-title {
            font-size: 2vw;
          }
        `}
        style={{
          position: 'fixed',
          zIndex: 1,
          backgroundColor: '#fff',
          width: '100%',
          height: '5%',
        }}
        back="返回"
        onBack={onBack}
      >
        产品详情
      </NavBar>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Image src={detailHeaderImpage} width="100%" />
        <Image src={detailContentImage} width="100%" />
      </div>
    </>
  );
};
