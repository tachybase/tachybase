import React from 'react';
import { css, useRequest } from '@tachybase/client';
import { dayjs } from '@tachybase/utils/client';

import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, List, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useInitializationLinkKey, useLinkKey } from '../../hooks/useNotifications';

export const Notifications = () => {
  // 注册链接关联，链接管理使用tachybase代码方式注册数据表
  useInitializationLinkKey();
  const linkDetail = useLinkKey();

  const navigate = useNavigate();
  const { data, run } = useRequest<{ data: any }>({
    url: `/system_notifications:get`,
  });
  const getNotificationList = data?.data || [];
  const { run: updateRead } = useRequest<{ data: any }>(
    {
      url: `/system_notifications:update`,
      params: {
        ids: getNotificationList.map((item) => item.id),
      },
    },
    {
      onSuccess() {
        run();
      },
    },
  );
  const content = (
    <List
      style={{ width: '400px' }}
      itemLayout="horizontal"
      dataSource={getNotificationList}
      footer={
        <Button.Group style={{ width: '100%' }}>
          <Button
            block
            onClick={() => {
              updateRead();
            }}
          >
            全部已读
          </Button>
          <Button
            block
            onClick={() => {
              navigate(linkDetail?.link);
            }}
          >
            查看更多
          </Button>
        </Button.Group>
      }
      renderItem={(item: any) => (
        <List.Item>
          <List.Item.Meta title={item.title} description={dayjs(item.createdAt).calendar()} />
          {item.content}
        </List.Item>
      )}
    />
  );
  return (
    <div
      className={css`
        .ant-btn {
          border: 0;
          height: 46px;
          width: 46px;
          border-radius: 0;
          background: none;
          color: rgba(255, 255, 255, 0.65) !important;
          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }
        }
        a {
          padding-top: 12px;
        }
        .ant-badge-count {
          min-width: 10px;
          height: 10px;
          line-height: 10px;
          font-size: 9px;
          border-radius: 5px;
          padding: 0 2px;
        }
      `}
      style={{ display: 'inline-block' }}
    >
      <Popover content={content}>
        <Badge count={getNotificationList.length} size="small" offset={[-15, 15]}>
          <Button role="button">
            <BellOutlined />
          </Button>
        </Badge>
      </Popover>
    </div>
  );
};
