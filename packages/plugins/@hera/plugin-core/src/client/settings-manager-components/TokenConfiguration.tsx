import React, { useEffect, useMemo } from 'react';
import { useAPIClient } from '@tachybase/client';

import { useBoolean } from 'ahooks';
import { Button, Card, Form, Input, message, Tabs } from 'antd';
import { useLocation } from 'react-router-dom';

import { getSSKey, TokenConfigurationResourceKey, useMapConfiguration } from '../hooks/useTokenConfiguration';

interface BaseConfigurationProps {
  type: 'feishu';
}

export const TokenTypes = [{ label: '飞书', value: 'feishu' }];

const BaseConfiguration: React.FC<BaseConfigurationProps> = ({ type, children }) => {
  const [isDisabled, disableAction] = useBoolean(false);
  const apiClient = useAPIClient();
  const [form] = Form.useForm();
  const data = useMapConfiguration(type);
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      disableAction.toggle();
    }
  }, [data]);

  const resource = useMemo(() => {
    return apiClient.resource(TokenConfigurationResourceKey);
  }, [apiClient]);

  const onSubmit = (values) => {
    resource
      .set({
        ...values,
        type,
      })
      .then((res) => {
        sessionStorage.removeItem(getSSKey(type));
        disableAction.toggle();
        message.success('保存成功');
      })
      .catch((err) => {
        message.success('保存失败');
      });
  };
  return (
    <Form disabled={isDisabled} form={form} layout="vertical" onFinish={onSubmit}>
      {children}
      {isDisabled ? (
        <Button disabled={false} onClick={disableAction.toggle}>
          编辑
        </Button>
      ) : (
        <Form.Item>
          <Button disabled={false} type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

const AMapConfiguration = () => {
  return (
    <BaseConfiguration type="feishu">
      <Form.Item required name="app_id" label="App ID">
        <Input />
      </Form.Item>
      <Form.Item required name="app_secret" label="App Secret">
        <Input />
      </Form.Item>
      <Form.Item required name="chat_id" label="Chat ID">
        <Input />
      </Form.Item>
    </BaseConfiguration>
  );
};

const components = {
  feishu: AMapConfiguration,
};

const tabList = TokenTypes.map((item) => {
  return {
    ...item,
    component: components[item.value],
  };
});

export const Configuration = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  return (
    <Card bordered>
      <Tabs type="card" defaultActiveKey={search.get('tab')}>
        {tabList.map((tab) => {
          return (
            <Tabs.TabPane key={tab.value} tab={tab.label}>
              <tab.component type={tab.value} />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </Card>
  );
};
