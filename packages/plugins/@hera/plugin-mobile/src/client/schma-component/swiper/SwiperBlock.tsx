import { BlockItem, css, useDesignable, useRequest, withDynamicSchemaProps } from '@nocobase/client';
import { useFieldSchema } from '@nocobase/schema';
import { Swiper } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SwiperBlock = withDynamicSchemaProps((props) => {
  const { fieldValue, data, changeNav } = props;
  if (!data) return;
  const items = data['data']
    ?.map((imgItem, index) => {
      return imgItem[fieldValue] ? (
        <Swiper.Item key={index}>
          <div
            className={css`
              height: 20vh;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 48px;
              user-select: none;
            `}
            style={{
              backgroundImage: `url(${imgItem[fieldValue][0].url})`,
              backgroundSize: '100% 100%',
              backgroundAttachment: 'fixed',
            }}
            onClick={() => {
              changeNav(imgItem);
            }}
          ></div>
        </Swiper.Item>
      ) : null;
    })
    .filter(Boolean);
  return (
    <BlockItem>
      <Swiper loop autoplay>
        {items}
      </Swiper>
    </BlockItem>
  );
});
