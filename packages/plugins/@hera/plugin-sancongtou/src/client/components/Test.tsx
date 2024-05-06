import { Button } from 'antd-mobile';
import React from 'react';

export const TestComponent = () => {
  const handleClick = () => {};
  return (
    <Button style={{ alignSelf: 'center', fontSize: '5rem' }} block color="primary" size="large" onClick={handleClick}>
      Hello
    </Button>
  );
};
