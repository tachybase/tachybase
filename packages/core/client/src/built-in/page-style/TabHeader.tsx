import React, { useContext } from 'react';

import { Button } from 'antd';
import { useNavigate } from 'react-router';

import { Icon } from '../../icon';
import { PageStyleContext } from './PageStyle.provider';

export const TabHeader = () => {
  const navigate = useNavigate();
  const { items, setItems } = useContext(PageStyleContext);
  return items.map((item) => (
    <span key={item.key}>
      <Button
        type="text"
        onClick={() => {
          navigate(`/admin/${item.key}`);
        }}
      >
        {item.label}
      </Button>
      <Button
        type="text"
        onClick={() => {
          setItems((items) => {
            return items.filter((i) => i.key !== item.key);
          });
        }}
        icon={<Icon type="CloseOutlined" />}
      ></Button>
    </span>
  ));
};
