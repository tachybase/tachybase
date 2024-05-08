import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActionInitializer, useRequest } from '@tachybase/client';
import { Button, Divider, Input, InputRef, Radio, Select, Space } from 'antd';
import { PdfPaperSwitchingContext } from '../../hooks/usePdfPath';
import { PlusOutlined } from '@ant-design/icons';

export const PaperSwitching = (props) => {
  const { setPaper } = useContext(PdfPaperSwitchingContext);

  const index = 0;
  const [items, setItems] = useState(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4']);
  // const [name, setName] = useState('');
  // const inputRef = useRef<InputRef>(null);
  // const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  // const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   setItems([...items, name || `New item ${index++}`]);
  //   setName('');
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 0);
  // };
  const handleChange = (event) => {
    setPaper(event);
  };
  return (
    <Select
      style={{ width: 100 }}
      placeholder="custom dropdown render"
      onChange={handleChange}
      defaultValue="A4"
      dropdownRender={(menu) => (
        <>
          {menu}
          {/* <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              自定义宽高
            </Button>
          </Space> */}
        </>
      )}
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
};

export const PaperSwitchingInitializer = (props) => {
  const schema = {
    title: '{{ t("paper switching") }}',
    'x-action': 'paperSwitching',
    'x-component': 'PaperSwitching',
    'x-designer': 'Action.Designer',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
