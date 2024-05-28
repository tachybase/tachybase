import React from 'react';

import { CustomComponentType } from '@hera/plugin-core/client';
import { Link, useNavigate } from 'react-router-dom';

import './style.less';

import { getPathProductDetail } from '../utils/path';

// @deprecated
export const ShowDetail = () => {
  // const navigate = useNavigate();
  // const handleClick = () => {
  //   navigate('/mobile/');
  // };
  return (
    <Link className={'m-detail'} to={getPathProductDetail({ dataSource: 'main', collection: 'cards', id: '15' })}>
      显示详情
    </Link>
  );
  Ø;
};

ShowDetail.displayName = 'ShowDetail';
ShowDetail.__componentType = CustomComponentType.CUSTOM_FORM_ITEM;
ShowDetail.__componentLabel = '移动端-三聪头-显示详情';
