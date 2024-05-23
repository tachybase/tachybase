import React from 'react';

import { Button, Checkbox, Form, Input } from 'antd';

import type { ComponentDemo } from '../../interface';

const Demo = () => {
  const onFinish = () => {};
  const onFinishFailed = () => {};
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorError', 'controlOutline', 'colorErrorBorder', 'colorErrorHover'],
  key: 'default',
};

export default componentDemo;
