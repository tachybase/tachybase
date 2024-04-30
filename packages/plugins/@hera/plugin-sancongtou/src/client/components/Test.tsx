import { Button } from 'antd-mobile';
import React from 'react';
import { showModal } from './Share';

export const TestComponent = () => {
  const handleClick = () => {
    showModal();
  };
  return (
    <Button style={{ alignSelf: 'center', fontSize: '5rem' }} block color="primary" size="large" onClick={handleClick}>
      Hello
    </Button>
  );
};
