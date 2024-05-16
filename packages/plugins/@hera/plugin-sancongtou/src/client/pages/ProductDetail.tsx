import { css } from '@tachybase/client';
import { Image, NavBar } from 'antd-mobile';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import detailContentImage from '../assets/detail_lt_content.png';
import detailHeaderImpage from '../assets/detail_lt_header.png';
import './style.css';

export const ProductDetail = () => {
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f3f3f3',
      }}
    >
      <NavBar
        // className={css`
        //   .adm-nav-bar-left,
        //   .adm-nav-bar-title {
        //     font-size: 2vw;
        //   }
        // `}
        // style={{
        //   position: 'fixed',
        //   zIndex: 1,
        //   backgroundColor: '#fff',
        //   width: '100%',
        //   height: '5%',
        // }}
        back="返回"
        onBack={onBack}
      >
        产品详情
      </NavBar>
      <div className={'m-share-image'}>
        <Image src={detailHeaderImpage} width="100%" />
        <Image src={detailContentImage} width="100%" />
      </div>
    </div>
  );
};
