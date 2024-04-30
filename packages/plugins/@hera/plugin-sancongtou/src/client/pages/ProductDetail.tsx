import { Image } from 'antd-mobile';
import React from 'react';
import detailHeaderImpage from '../assets/detail_lt_header.png';
import detailContentImage from '../assets/detail_lt_content.png';

export const ProductDetail = () => {
  return (
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
  );
};
