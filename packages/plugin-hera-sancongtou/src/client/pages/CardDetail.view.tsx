import React from 'react';
import { withDynamicSchemaProps } from '@tachybase/client';

import { Image, NavBar, Skeleton } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import './style.less';

// TODO: 需要提升图片加载速度, 现在是数据库请求然后用 url 去云端拿图片，导致体验有延迟
export const CardDetailView = withDynamicSchemaProps(
  (props) => {
    const { images = [] } = props;
    const navigate = useNavigate();
    const onBack = () => {
      navigate(-1);
    };
    return (
      <div className="m-product-container">
        <NavBar back="返回" onBack={onBack}>
          产品详情
        </NavBar>
        <div className={'m-share-image'}>
          <ImageWithSkeletonCustom imageSrc={images[0]} />
          <ImageWithSkeletonCustom imageSrc={images[1]} />
        </div>
      </div>
    );
  },
  { displayName: 'CardDetailView' },
);

const ImageWithSkeletonCustom = (props) => {
  const { imageSrc } = props;
  if (imageSrc) {
    return <Image src={imageSrc} width="100%" />;
  } else {
    return <Skeleton animated className={'customSkeleton'} />;
  }
};
