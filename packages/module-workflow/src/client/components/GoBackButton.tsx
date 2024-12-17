import React from 'react';
import { Icon } from '@tachybase/client';

import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const BackButton = (props) => {
  const navigate = useNavigate();
  return (
    <Button
      type="text"
      icon={<Icon type="ArrowLeftOutlined" />}
      onClick={() => {
        navigate(-1);
      }}
      {...props}
    />
  );
};
