import { BlockItem, css, useDesignable, useRequest, withDynamicSchemaProps } from '@nocobase/client';
import { Swiper } from 'antd-mobile';
import React from 'react';

export const SwiperBlock = withDynamicSchemaProps((props) => {
  const { fieldValue, data, changeNav } = props;
  if (!data) return;
  const items = data['data'].length
    ? data['data']
        .map((imgItem, index) => {
          return imgItem[fieldValue][0]?.url ? (
            <Swiper.Item key={index}>
              <div
                className={swiperStyle}
                style={{
                  backgroundImage: `url(${imgItem[fieldValue][0]?.url})`,
                  backgroundSize: '100% 100%',
                  backgroundAttachment: 'fixed',
                }}
                onClick={() => {
                  changeNav(imgItem);
                }}
              ></div>
            </Swiper.Item>
          ) : (
            <Swiper.Item key={index}>
              <div
                className={swiperStyle}
                style={{
                  backgroundColor: '#e0e0e0',
                }}
              >
                无法加载此内容
              </div>
            </Swiper.Item>
          );
        })
        .filter(Boolean)
    : [
        <Swiper.Item key={0}>
          <div
            className={swiperStyle}
            style={{
              backgroundColor: '#e0e0e0',
            }}
          >
            当前区块没有可加载数据
          </div>
        </Swiper.Item>,
      ];

  return (
    <BlockItem>
      <Swiper loop autoplay>
        {items}
      </Swiper>
    </BlockItem>
  );
});

const swiperStyle = css`
  height: 20vh;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  user-select: none;
`;
