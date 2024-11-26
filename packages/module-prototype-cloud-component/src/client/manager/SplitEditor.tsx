import React from 'react';

import { Button, Tabs } from 'antd';

const operations = <Button>Extra Action</Button>;

const items = new Array(3).fill(null).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of tab ${id}`,
  };
});

const App = () => {
  return <Tabs tabBarExtraContent={operations} items={items} />;
};

export default App;
